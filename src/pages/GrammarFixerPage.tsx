import { motion } from "framer-motion";
import { PenTool } from "lucide-react";

export default function GrammarFixerPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
         <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
           <PenTool className="w-8 h-8 text-primary" />
         </div>
         <h2 className="text-2xl font-bold tracking-tight">Grammar Fixer</h2>
         <p className="text-muted-foreground mt-2 max-w-md">Paste your raw text here to instantly fix grammatical errors and refine the professional tone.</p>
      </motion.div>
    </div>
  );
}
