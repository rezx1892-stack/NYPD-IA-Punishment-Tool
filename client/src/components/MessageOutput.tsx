import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface MessageOutputProps {
  message: string;
}

export function MessageOutput({ message }: MessageOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2 mt-6"
    >
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Generated Output
        </label>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 text-xs gap-1.5 hover:bg-primary/10 hover:text-primary"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy Text"}
        </Button>
      </div>
      
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl" />
        <textarea
          readOnly
          value={message}
          className="w-full h-48 bg-card border border-border rounded-xl p-4 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-foreground/90 shadow-inner"
        />
      </div>
    </motion.div>
  );
}
