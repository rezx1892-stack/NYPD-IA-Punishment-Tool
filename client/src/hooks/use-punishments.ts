import { useQuery, useMutation } from "@tanstack/react-query";
import { api, type GenerateMessageInput, type GenerateMessageResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useOffenses() {
  return useQuery({
    queryKey: [api.offenses.list.path],
    queryFn: async () => {
      // Use direct mock data for GitHub Pages since there's no backend
      // Using a broader check to ensure it works on subdomains/custom domains on GitHub Pages
      if (window.location.hostname.endsWith("github.io") || window.location.hostname.includes("rezx1892-stack.github.io")) {
        console.log("GitHub Pages detected, providing mock offenses");
        return [
          {id:3687,code:"0.1",description:"No VC picture in patrol log",punishment:"Logged warning",category:"Category 0"},
          {id:3688,code:"0.2",description:"Reacting but not showing up to an event",punishment:"Logged warning",category:"Category 0"},
          {id:3689,code:"0.3",description:"Patrolling without an F.T.O",punishment:"Logged warning",category:"Category 0"},
          {id:3691,code:"0.5",description:"Improper Use of Force",punishment:"One Strike",category:"Category 0"},
          {id:3692,code:"0.6",description:"Acting immature/unprofessional in game",punishment:"One Strike",category:"Category 0"},
          {id:3696,code:"1.0",description:"Trolling",punishment:"One Strike",category:"Category 1"},
          {id:3697,code:"1.1",description:"Dress code issues",punishment:"Logged Warning or One Strike",category:"Category 1"},
          {id:3708,code:"2.2",description:"Threatening or harassment",punishment:"NYPD Blacklist perm",category:"Category 2"},
          {id:3709,code:"2.3",description:"Leaking info",punishment:"NYPD Blacklist perm",category:"Category 2"}
        ];
      }
      const res = await fetch(api.offenses.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch offenses");
      return api.offenses.list.responses[200].parse(await res.json());
    },
  });
}

export function useGenerateMessage() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GenerateMessageInput) => {
      // Local generation for GitHub Pages
      if (window.location.hostname.endsWith("github.io") || window.location.hostname.includes("rezx1892-stack.github.io")) {
        const selectedOffenses = data.offenseIds.length > 0 
          ? `Offenses: ${data.offenseIds.join(", ")}` 
          : "No specific offenses selected";
        
        const message = `**NYPD PUNISHMENT LOG**
HR ID: ${data.hrId}
Target ID: ${data.userId}
Action: ${data.action}
${data.manualAction ? `Details: ${data.manualAction}` : ""}
${selectedOffenses}
${data.duration ? `Duration: ${data.duration}` : ""}
${data.notes ? `Notes: ${data.notes}` : ""}`;

        return { message, id: Date.now(), success: true };
      }

      const res = await fetch(api.logs.generate.path, {
        method: api.logs.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to generate punishment");
      }

      return api.logs.generate.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      // Auto-copy to clipboard as requested in requirements
      navigator.clipboard.writeText(data.message);
      toast({
        title: "Message Generated",
        description: "The punishment message has been copied to your clipboard.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
