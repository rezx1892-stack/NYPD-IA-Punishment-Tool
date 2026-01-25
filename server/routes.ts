import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerChatRoutes } from "./replit_integrations/chat";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

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

      const offenseText = selectedOffenses.map(o =>
        `- ${o.code} ${o.description} (${o.punishment})`
      ).join("\n");

      let message = "";

      if (input.useAi) {
        // AI Enhanced Message
        const prompt = `
          You are an Internal Affairs officer in a roleplay server.
          Generate a formal and professional ${input.action} message.

          Details:
          HR ID: ${input.hrId}
          User ID: ${input.userId}
          Ticket Number: ${input.ticketNumber}
          Duration: ${input.duration}
          Action: ${input.action}
          Offenses:
          ${offenseText}
          Notes: ${input.notes || "None"}

          Format the output clearly. Do not include introductory text, just the message.
        `;

        const response = await openai.chat.completions.create({
          model: "gpt-5.1",
          messages: [{ role: "user", content: prompt }],
          max_completion_tokens: 512,
        });

        message = response.choices[0]?.message?.content || "Failed to generate AI message.";
      } else {
        // Standard Template Message
        const date = new Date().toLocaleDateString();
        message = `
**IA Action Report**

**HR ID:** ${input.hrId}
**Target User ID:** ${input.userId}
**Ticket:** #${input.ticketNumber}
**Date:** ${date}
**Action:** ${input.action}
**Duration:** ${input.duration}

**Offenses:**
${offenseText}

${input.notes ? `**Notes:**\n${input.notes}` : ""}
        `.trim();
      }

      // Log the generation (optional, but good for auditing)
      await storage.createLog({
        hrId: input.hrId,
        userId: input.userId,
        ticketNumber: input.ticketNumber,
        action: input.action,
        duration: input.duration,
        offenses: selectedOffenses.map(o => o.code),
        notes: input.notes,
        generatedMessage: message,
      });

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
