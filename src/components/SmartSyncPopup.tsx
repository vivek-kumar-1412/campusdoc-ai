import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CopyCheck, Undo2, Sparkles } from "lucide-react";
import { SyncSuggestion } from "@/hooks/useSmartAutoSync";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface SmartSyncPopupProps {
  suggestion: SyncSuggestion | null;
  anchor: { x: number; y: number } | null;
  onAccept: () => void;
  onDismiss: () => void;
  lastSyncAction: (() => void) | null;
  onUndo: () => void;
}

export function SmartSyncPopup({
  suggestion,
  anchor,
  onAccept,
  onDismiss,
  lastSyncAction,
  onUndo,
}: SmartSyncPopupProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep popup within viewport bounds
  const getSafePosition = (x: number, y: number) => {
    if (typeof window === "undefined") return { top: y, left: x };
    const safeX = Math.min(x, window.innerWidth - 340);
    const safeY = Math.min(y, window.innerHeight - 150);
    return { top: safeY, left: Math.max(0, safeX) };
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <AnimatePresence>
        {suggestion && anchor && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-[9999] bg-background/95 backdrop-blur-xl border border-white/10 shadow-glass rounded-xl p-4 w-[320px] shadow-2xl"
            style={getSafePosition(anchor.x, anchor.y + 10)}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-1 text-foreground">Smart Auto Sync</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  This text edit applies to <strong className="text-foreground">{suggestion.targetDocs.length} other linked document{suggestion.targetDocs.length !== 1 ? "s" : ""}</strong>. Update everywhere?
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={onAccept} className="w-full h-8 text-xs">
                    Update All
                  </Button>
                  <Button size="sm" variant="outline" onClick={onDismiss} className="w-full h-8 text-xs bg-transparent border-white/10">
                    This Only
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!suggestion && lastSyncAction && anchor && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-[9999] bg-background/95 backdrop-blur-xl border border-white/10 shadow-glass rounded-xl p-3 px-4 flex items-center justify-between gap-4 shadow-xl"
            style={getSafePosition(anchor.x, anchor.y + 10)}
          >
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <CopyCheck className="w-4 h-4 text-green-500" />
              Synced all documents
            </span>
            <Button size="sm" variant="ghost" onClick={() => {
              onUndo();
            }} className="h-7 text-xs px-2 hover:bg-white/10">
              <Undo2 className="w-3.5 h-3.5 mr-1" /> Undo
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
