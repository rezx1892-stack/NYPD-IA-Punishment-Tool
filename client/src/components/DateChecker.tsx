import { useState } from "react";
import { differenceInDays, parse, isValid } from "date-fns";
import { Calculator, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DateChecker() {
  const [dateStr, setDateStr] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculateDays = () => {
    // Try formats: MM/DD/YYYY or YYYY-MM-DD
    let date = parse(dateStr, "MM/dd/yyyy", new Date());
    if (!isValid(date)) {
      date = parse(dateStr, "yyyy-MM-dd", new Date());
    }

    if (isValid(date)) {
      setResult(differenceInDays(new Date(), date));
    } else {
      setResult(null);
    }
  };

  return (
    <div className="bg-secondary/20 rounded-xl p-4 border border-border/50 space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
        <Calendar className="w-4 h-4 text-primary" />
        Time Calculator
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="MM/DD/YYYY"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          className="flex-1 bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
        />
        <Button 
          size="sm" 
          variant="outline" 
          onClick={calculateDays}
          className="hover:bg-primary/10 hover:text-primary hover:border-primary/30"
        >
          <Calculator className="w-4 h-4" />
        </Button>
      </div>

      {result !== null && (
        <div className="text-xs font-mono bg-background/50 p-2 rounded border border-border text-center">
          <span className="text-muted-foreground">Difference: </span>
          <span className="text-primary font-bold">{result} days</span>
        </div>
      )}
    </div>
  );
}
