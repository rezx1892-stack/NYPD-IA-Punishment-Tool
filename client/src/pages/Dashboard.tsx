import { useState, useEffect } from "react";
import { useOffenses, useGenerateMessage } from "@/hooks/use-punishments";
import { OffenseSelector } from "@/components/OffenseSelector";
import { DateChecker } from "@/components/DateChecker";
import { MessageOutput } from "@/components/MessageOutput";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ShieldCheck, User, FileText, Clock, Hash, Activity } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { data: offenses = [], isLoading: loadingOffenses } = useOffenses();
  const generateMutation = useGenerateMessage();
  
  // Form State
  const [hrId, setHrId] = useState("");
  const [userId, setUserId] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [duration, setDuration] = useState("");
  const [manualAction, setManualAction] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedOffenseIds, setSelectedOffenseIds] = useState<number[]>([]);
  const [generatedMessage, setGeneratedMessage] = useState("");

  // Persist HR ID
  useEffect(() => {
    const savedHrId = localStorage.getItem("hrId");
    if (savedHrId) setHrId(savedHrId);
  }, []);

  useEffect(() => {
    if (hrId) localStorage.setItem("hrId", hrId);
  }, [hrId]);

  const handleGenerate = async (action: "Punishment" | "Revoke") => {
    if (!hrId || !userId) {
      // Basic client validation
      return; 
    }

    try {
      const result = await generateMutation.mutateAsync({
        hrId,
        userId,
        ticketNumber: ticketNumber || undefined,
        duration: duration || undefined,
        action,
        manualAction: manualAction || undefined,
        offenseIds: selectedOffenseIds,
        notes,
        useAi: false,
      });
      setGeneratedMessage(result.message);
    } catch (error) {
      // Error handled by hook toast
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Navigation / Sidebar */}
      <aside className="w-full md:w-64 lg:w-72 bg-card border-r border-border p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-none">Punishment<br/>Manager</h1>
          </div>
        </div>

        <div className="space-y-6 flex-1">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Officer Details</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                value={hrId}
                onChange={(e) => setHrId(e.target.value)}
                placeholder="Enter HR ID"
                className="w-full bg-secondary/50 border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-border/50">
            <DateChecker />
          </div>
        </div>

        <div className="mt-auto pt-6 text-xs text-muted-foreground/50 text-center font-mono">
          v2.5.0 • Authorized Personnel Only
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-[calc(100vh-theme(spacing.16))] md:h-screen overflow-hidden flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden p-4 border-b border-border bg-card flex items-center justify-between">
           <span className="font-display font-bold">Punishment Manager</span>
           <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Mobile View</span>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full flex flex-col lg:flex-row gap-6">
            
            {/* Left Column: Offenses */}
            <section className="lg:w-1/2 xl:w-7/12 h-[500px] lg:h-full flex flex-col">
              <OffenseSelector 
                offenses={offenses} 
                selectedIds={selectedOffenseIds} 
                onChange={setSelectedOffenseIds}
                isLoading={loadingOffenses}
              />
            </section>

            {/* Right Column: Form & Actions */}
            <section className="lg:w-1/2 xl:w-5/12 flex flex-col gap-6">
              
              {/* Main Form Card */}
              <div className="bg-card rounded-2xl border border-border p-5 shadow-lg space-y-5">
                <div className="flex items-center gap-2 mb-2 pb-4 border-b border-border/50">
                  <FileText className="w-5 h-5 text-primary" />
                  <h2 className="font-display font-bold text-lg">Case Details</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> Target User ID
                    </label>
                    <input
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="e.g. 849201"
                      className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5" /> Ticket #
                    </label>
                    <input
                      value={ticketNumber}
                      onChange={(e) => setTicketNumber(e.target.value)}
                      placeholder="#0000"
                      className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" /> Action Taken
                  </label>
                  <input
                    value={manualAction}
                    onChange={(e) => setManualAction(e.target.value)}
                    placeholder="e.g. Logged Warning, Demotion, etc."
                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Duration
                  </label>
                  <input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 24 Hours, Permanent"
                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Additional Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any specific context..."
                    className="w-full h-20 bg-background border border-input rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div className="pt-2 grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => handleGenerate("Punishment")}
                    disabled={generateMutation.isPending}
                    className="w-full bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 border border-red-700/50 shadow-lg shadow-red-900/20"
                  >
                    {generateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Punishment
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => handleGenerate("Revoke")}
                    disabled={generateMutation.isPending}
                    className="w-full border-green-800/50 text-green-500 hover:bg-green-950/30 hover:text-green-400"
                  >
                    {generateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <ShieldCheck className="mr-2 w-4 h-4" />
                    Generate Revoke
                  </Button>
                </div>
              </div>

              {/* Generated Output */}
              {generatedMessage && (
                <MessageOutput message={generatedMessage} />
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
