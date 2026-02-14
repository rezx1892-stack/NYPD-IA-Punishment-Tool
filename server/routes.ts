import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerChatRoutes } from "./replit_integrations/chat";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register AI routes
  registerChatRoutes(app);

  // Initialize DB with offenses
  await storage.seedOffenses();

  app.get(api.offenses.list.path, async (req, res) => {
    const offenses = await storage.getOffenses();
    res.json(offenses);
  });

  app.post(api.logs.create.path, async (req, res) => {
    try {
      const input = api.logs.create.input.parse(req.body);
      const log = await storage.createLog(input);
      res.status(201).json(log);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.post(api.logs.generate.path, async (req, res) => {
    try {
      const input = api.logs.generate.input.parse(req.body);

      // Fetch selected offenses details
      const allOffenses = await storage.getOffenses();
      const selectedOffenses = allOffenses.filter(o => input.offenseIds.includes(o.id));

      let message = "";

      if (input.action === "Punishment") {
        const offenseNumbers = selectedOffenses.map(o => `Offense ${o.code}`).join(", ");
        // Use manualAction if provided, otherwise leave it blank
        const actionText = input.manualAction || "";
        
        message = `<:IA:1287467525923143751>  I PUNISHMENT I <:IA:1287467525923143751>   
HR: <@${input.hrId}>
User(s): <@${input.userId}>
Reason: ${offenseNumbers || ""}
Action: ${actionText}
Duration: ${input.duration || ""}
Note:  **User can appeal if they think this was a mistake —>  #ticket-support **
Proof: <:IA:1287467525923143751> Ticket - ${input.ticketNumber || ""} <:IA:1287467525923143751>`;
      } else {
        // Revoke format
        message = `<:IA:1287467525923143751> | Revoked: <@${input.userId}>
<:IA:1287467525923143751> | Reason: Ticket-${input.ticketNumber || ""}`;
      }

      // Log the generation
      try {
        await storage.createLog({
          hrId: input.hrId,
          userId: input.userId,
          ticketNumber: input.ticketNumber || "",
          action: input.action,
          manualAction: input.manualAction || "",
          duration: input.duration || "",
          offenses: selectedOffenses.map(o => o.code),
          notes: input.notes,
          generatedMessage: message,
        });
      } catch (logErr) {
        console.error("Failed to log punishment:", logErr);
        // Continue even if logging fails, so the user gets their message
      }

      res.json({ message });

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Generation error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
