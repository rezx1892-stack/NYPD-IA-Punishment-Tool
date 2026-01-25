import { useQuery, useMutation } from "@tanstack/react-query";
import { api, type GenerateMessageInput, type GenerateMessageResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useOffenses() {
  return useQuery({
    queryKey: [api.offenses.list.path],
    queryFn: async () => {
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
