import { useEffect, useState, useRef, useCallback } from "react";
import { useDocuments } from "@/lib/store";
import { findDiff } from "@/lib/diffEngine";

interface TargetDocInfo {
  id: string;
  projectId: string;
  content: string;
}

export interface SyncSuggestion {
  oldText: string;
  newText: string;
  sourceDocId: string;
  sourceContent: string;
  projectId: string;
  targetDocs: TargetDocInfo[];
}

export function useSmartAutoSyncObserver() {
  const { documents, updateDocument } = useDocuments();
  const [suggestion, setSuggestion] = useState<SyncSuggestion | null>(null);
  const [popupAnchor, setPopupAnchor] = useState<{ x: number; y: number } | null>(null);

  const prevTextRef = useRef<Map<HTMLTextAreaElement, string>>(new Map());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSyncingRef = useRef<boolean>(false);

  // Expose an undo function. We'd keep a stack in a real app, but 1 layer is fine for now.
  const [lastSyncAction, setLastSyncAction] = useState<(() => void) | null>(null);

  // Setup input listener on document via delegation
  useEffect(() => {
    const handleInput = (e: Event) => {
      const target = e.target as HTMLTextAreaElement;
      if (!target || target.tagName !== "TEXTAREA") return;
      if (isSyncingRef.current) return;

      const docId = target.getAttribute("data-document-id") || "draft";
      const projectId = target.getAttribute("data-project-id");
      
      if (!projectId) return;

      const currentText = target.value;
      let oldText = prevTextRef.current.get(target);

      if (typeof oldText !== "string") {
        // If we didn't catch the focus event for some reason, just initialize it now and wait for the next input
        prevTextRef.current.set(target, currentText);
        return;
      }

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce the diff calculation to avoid spam
      debounceTimerRef.current = setTimeout(() => {
        const diff = findDiff(oldText, currentText);
        console.log("[SmartAutoSync] Diff detected:", diff);
        if (diff) {
          // Check if oldText exists in other documents belonging to the same project
          const syncableDocs = documents.filter(d => 
            d.projectId === projectId && 
            d.id !== docId && 
            d.content.includes(diff.oldText)
          );

          console.log("[SmartAutoSync] Syncable docs:", syncableDocs.length, "for project:", projectId);

          if (syncableDocs.length > 0) {
            // Calculate popup position (approximate near bottom right of cursor/textarea)
            const rect = target.getBoundingClientRect();
            // Try to place it lower-right or inside the textarea
            setPopupAnchor({
              x: rect.right - 200 > 0 ? rect.right - 200 : rect.right,
              y: rect.bottom - 40 > 0 ? rect.bottom - 40 : rect.bottom
            });

            setSuggestion({
              oldText: diff.oldText,
              newText: diff.newText,
              sourceDocId: docId,
              sourceContent: currentText,
              projectId: projectId,
              targetDocs: syncableDocs.map(d => ({
                id: d.id,
                projectId: d.projectId,
                content: d.content
              }))
            });
          } else {
            setSuggestion(null);
            setPopupAnchor(null);
          }
        }
        
        // Update the baseline after the burst is complete and processed
        prevTextRef.current.set(target, currentText);
      }, 1000); // Wait 1000ms after the last typing event
    };

    const handleFocus = (e: Event) => {
      const target = e.target as HTMLTextAreaElement;
      if (!target || target.tagName !== "TEXTAREA") return;
      prevTextRef.current.set(target, target.value);
    };

    const handleBlur = () => {
       // Optionally hide suggestion on blur, but we might want the user to click it
       // We'll let the popup handle its own close
    };

    document.addEventListener("input", handleInput, true);
    document.addEventListener("focus", handleFocus, true);
    document.addEventListener("blur", handleBlur, true);

    return () => {
      document.removeEventListener("input", handleInput, true);
      document.removeEventListener("focus", handleFocus, true);
      document.removeEventListener("blur", handleBlur, true);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [documents]);

  const acceptSync = useCallback(() => {
    if (!suggestion) return;
    isSyncingRef.current = true;

    const previousStates: {id: string, content: string}[] = [];

    suggestion.targetDocs.forEach(doc => {
      previousStates.push({ id: doc.id, content: doc.content });

      // Search & Replace
      // Escape string for regex to perform global replace
      const escapedOldText = suggestion.oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedOldText, 'g');
      const newContent = doc.content.replace(regex, suggestion.newText);

      updateDocument(doc.id, { content: newContent });
    });

    if (suggestion.sourceDocId !== "draft") {
      updateDocument(suggestion.sourceDocId, { content: suggestion.sourceContent });
    }

    setLastSyncAction(() => {
      return () => {
        isSyncingRef.current = true;
        previousStates.forEach(state => {
           updateDocument(state.id, { content: state.content });
        });
        setTimeout(() => { isSyncingRef.current = false; }, 100);
      }
    });

    setSuggestion(null);
    setPopupAnchor(null);
    
    setTimeout(() => { isSyncingRef.current = false; }, 100);
  }, [suggestion, updateDocument]);

  const dismissSync = useCallback(() => {
    if (suggestion && suggestion.sourceDocId !== "draft") {
      updateDocument(suggestion.sourceDocId, { content: suggestion.sourceContent });
    }
    setSuggestion(null);
    setPopupAnchor(null);
  }, [suggestion, updateDocument]);

  return {
    suggestion,
    popupAnchor,
    acceptSync,
    dismissSync,
    lastSyncAction,
    setLastSyncAction
  };
}
