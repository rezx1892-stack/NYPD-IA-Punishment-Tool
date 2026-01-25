import { useState, useMemo } from "react";
import { type OffenseResponse } from "@shared/routes";
import { Search, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface OffenseSelectorProps {
  offenses: OffenseResponse[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  isLoading: boolean;
}

export function OffenseSelector({ offenses, selectedIds, onChange, isLoading }: OffenseSelectorProps) {
  const [search, setSearch] = useState("");

  const filteredOffenses = useMemo(() => {
    if (!search) return offenses;
    const lowerSearch = search.toLowerCase();
    return offenses.filter(
      (o) =>
        o.code.toLowerCase().includes(lowerSearch) ||
        o.description.toLowerCase().includes(lowerSearch) ||
        o.category.toLowerCase().includes(lowerSearch)
    );
  }, [offenses, search]);

  const groupedOffenses = useMemo(() => {
    const groups: Record<string, OffenseResponse[]> = {};
    filteredOffenses.forEach((o) => {
      if (!groups[o.category]) groups[o.category] = [];
      groups[o.category].push(o);
    });
    return groups;
  }, [filteredOffenses]);

  const toggleOffense = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((sid) => sid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const clearSelection = () => onChange([]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-muted-foreground text-sm">Loading regulations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border bg-secondary/20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold font-display flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            Regulation Selection
          </h2>
          {selectedIds.length > 0 && (
            <button
              onClick={clearSelection}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear {selectedIds.length} selected
            </button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search offenses (e.g. '0.1', 'troll', 'uniform')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background/50 border border-input rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-0">
        <div className="p-4 space-y-6">
          {Object.keys(groupedOffenses).sort().map((category) => (
            <div key={category} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 sticky top-0 bg-card/95 backdrop-blur-sm py-2 z-10 border-b border-border/50">
                {category}
              </h3>
              <div className="grid gap-2">
                {groupedOffenses[category].map((offense) => {
                  const isSelected = selectedIds.includes(offense.id);
                  return (
                    <motion.div
                      key={offense.id}
                      initial={false}
                      animate={{
                        backgroundColor: isSelected ? "hsl(var(--primary) / 0.1)" : "transparent",
                        borderColor: isSelected ? "hsl(var(--primary) / 0.3)" : "hsl(var(--border) / 0.5)",
                      }}
                      className={cn(
                        "group relative rounded-xl border p-3 cursor-pointer transition-all duration-200 hover:border-primary/50",
                        isSelected ? "shadow-[0_0_15px_-5px_hsl(var(--primary)/0.3)]" : "hover:bg-secondary/30"
                      )}
                      onClick={() => toggleOffense(offense.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-5 h-5 mt-0.5 rounded border flex items-center justify-center transition-colors",
                          isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30 bg-background"
                        )}>
                          {isSelected && (
                            <motion.svg
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </motion.svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-primary">{offense.code}</span>
                            <Badge variant={isSelected ? "default" : "secondary"} className="text-[10px] uppercase truncate max-w-[50%]">
                              {offense.punishment}
                            </Badge>
                          </div>
                          <p className={cn(
                            "text-sm font-medium leading-snug transition-colors",
                            isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/80"
                          )}>
                            {offense.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
          {filteredOffenses.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No offenses found matching "{search}"</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
