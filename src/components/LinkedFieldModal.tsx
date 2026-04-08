import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface LinkedFieldModalProps {
  open: boolean;
  onClose: () => void;
  fieldName: string;
  onConfirm: (updateAll: boolean) => void;
}

export function LinkedFieldModal({ open, onClose, fieldName, onConfirm }: LinkedFieldModalProps) {
  const [choice, setChoice] = useState<"this" | "all">("this");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🔗 Update Linked Documents
          </DialogTitle>
          <DialogDescription>
            You are editing the shared field "<span className="font-medium text-foreground">{fieldName}</span>". Choose how to apply this change.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <Label
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              choice === "this" ? "border-primary bg-accent" : "border-border"
            }`}
          >
            <input
              type="radio"
              name="update-choice"
              checked={choice === "this"}
              onChange={() => setChoice("this")}
              className="accent-foreground"
            />
            <span className="text-sm">Update This Document Only</span>
          </Label>
          <Label
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              choice === "all" ? "border-primary bg-accent" : "border-border"
            }`}
          >
            <input
              type="radio"
              name="update-choice"
              checked={choice === "all"}
              onChange={() => setChoice("all")}
              className="accent-foreground"
            />
            <span className="text-sm">Update All Linked Documents</span>
          </Label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm(choice === "all")}>
            Confirm Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
