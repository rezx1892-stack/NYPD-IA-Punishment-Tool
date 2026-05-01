import { useState } from "react";
import { differenceInDays, differenceInHours, parse, isValid } from "date-fns";
import { Calculator, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DateChecker() {
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("00:00");
  const [resultDays, setResultDays] = useState<number | null>(null);
  const [resultHours, setResultHours] = useState<number | null>(null);

  const calculateTime = () => {
    // Try formats: MM/DD/YYYY or YYYY-MM-DD
    let dateTimeStr = `${dateStr} ${timeStr}`;
    let date = parse(dateTimeStr, "MM/dd/yyyy HH:mm", new Date());
    if (!isValid(date)) {
      date = parse(dateTimeStr, "yyyy-MM-dd HH:mm", new Date());
    }

    if (isValid(date)) {
      const now = new Date();
      setResultDays(differenceInDays(now, date));
      setResultHours(differenceInHours(now, date));
    } else {
      setResultDays(null);
      setResultHours(null);
    }
  };

  return (
    <div className="bg-secondary/20 rounded-xl p-4 border border-border/50 space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
        <Calendar className="w-4 h-4 text-primary" />
        Time Calculator
      </div>
      
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="MM/DD/YYYY"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="flex-1 bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
          />
          <input
            type="time"
            placeholder="HH:MM"
            value={timeStr}
            onChange={(e) => setTimeStr(e.target.value)}
            className="w-24 bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <Button 
            size="sm" 
            variant="outline" 
            onClick={calculateTime}
            className="hover:bg-primary/10 hover:text-primary hover:border-primary/30"
          >
            <Calculator className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {(resultDays !== null || resultHours !== null) && (
        <div className="space-y-2 text-xs font-mono bg-background/50 p-2 rounded border border-border">
          {resultDays !== null && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Days: </span>
              <span className="text-primary font-bold">{resultDays}</span>
            </div>
          )}
          {resultHours !== null && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hours: </span>
              <span className="text-primary font-bold">{resultHours}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
