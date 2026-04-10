export interface DiffResult {
  oldText: string;
  newText: string;
}

function isBoundary(c: string | undefined): boolean {
  if (c === undefined) return true;
  return /[\s.,!?;:"'()[\]{}]/.test(c);
}

/**
 * Compares two strings and finds the context-aware changed block.
 * Uses word boundaries to ensure the search/replace string is meaningful.
 */
export function findDiff(oldDoc: string, newDoc: string): DiffResult | null {
  if (oldDoc === newDoc) return null;

  let start = 0;
  while (
    start < oldDoc.length &&
    start < newDoc.length &&
    oldDoc[start] === newDoc[start]
  ) {
    start++;
  }

  let oldEnd = oldDoc.length - 1;
  let newEnd = newDoc.length - 1;

  while (
    oldEnd >= start &&
    newEnd >= start &&
    oldDoc[oldEnd] === newDoc[newEnd]
  ) {
    oldEnd--;
    newEnd--;
  }

  // Expand start backwards to nearest boundary
  while (start > 0 && !isBoundary(oldDoc[start - 1])) {
    start--;
  }

  // Expand oldEnd forwards to nearest boundary
  while (oldEnd < oldDoc.length - 1 && !isBoundary(oldDoc[oldEnd + 1])) {
    oldEnd++;
  }
  
  // To keep `newText` aligned, we calculate how much we expanded on each side.
  // Wait, if we expanded `start` backwards by N chars, we must expand `newText` start backwards by N since the prefix matches exactly.
  // Actually, since prefix matches, oldDoc[start] === newDoc[start] is guaranteed if we just use the same `start` index!
  
  // How much did we expand `oldEnd` forwards? It's tracking from the end of the string.
  // The suffix matches exactly. So oldDoc[oldEnd] corresponds to newDoc[newEnd] plus the same expansion.
  // Let's find the matching newEnd.
  let suffixExpansion = 0;
  let tempOldEnd = oldDoc.length - 1;
  while (
    tempOldEnd >= start &&
    oldDoc[tempOldEnd] === newDoc[newDoc.length - 1 - (oldDoc.length - 1 - tempOldEnd)]
  ) {
     if (tempOldEnd === oldEnd) break;
     tempOldEnd--;
     suffixExpansion++;
  }
  // Wait, the original oldEnd was calculated from the back.
  // So expanded oldEnd means we picked up some suffix characters.
  // Let suffixLength = oldDoc.length - 1 - oldEnd; // number of suffix chars EXCLUDED.
  let originalOldSuffixLen = oldDoc.length - 1 - (oldEnd);

  // Let's do a simpler expansion approach:
  let diffStart = 0;
  while (diffStart < oldDoc.length && diffStart < newDoc.length && oldDoc[diffStart] === newDoc[diffStart]) diffStart++;
  
  let diffOldEnd = oldDoc.length - 1;
  let diffNewEnd = newDoc.length - 1;
  while (diffOldEnd >= diffStart && diffNewEnd >= diffStart && oldDoc[diffOldEnd] === newDoc[diffNewEnd]) {
    diffOldEnd--;
    diffNewEnd--;
  }

  // If the user only deleted text, the inserted length is 0.
  // The user requested that simply erasing text shouldn't trigger the sync popup.
  if (diffNewEnd - diffStart + 1 <= 0) {
    return null;
  }
  
  let expStart = diffStart;
  while (expStart > 0 && !isBoundary(oldDoc[expStart - 1])) expStart--;
  
  let expOldEnd = diffOldEnd;
  while (expOldEnd < oldDoc.length - 1 && !isBoundary(oldDoc[expOldEnd + 1])) expOldEnd++;
  
  // The new text must encompass the inserted portion plus the same expanded prefix/suffix.
  let prefixExpansion = diffStart - expStart;
  let suffixExpansionAmount = expOldEnd - diffOldEnd;
  
  let expNewEnd = diffNewEnd + suffixExpansionAmount;
  
  let oldText = oldDoc.substring(expStart, expOldEnd + 1);
  let newText = newDoc.substring(expStart, expNewEnd + 1);

  if (oldText.trim().length > 2) {
    return { oldText, newText };
  }

  return null;
}
