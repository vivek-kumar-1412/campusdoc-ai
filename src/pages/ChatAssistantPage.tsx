import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export default function ChatAssistantPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
         <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
           <Bot className="w-8 h-8 text-primary" />
         </div>
         <h2 className="text-2xl font-bold tracking-tight">Chat Assistant</h2>
         <p className="text-muted-foreground mt-2 max-w-md">Your AI Chat Assistant is ready to help you formulate questions, draft clauses, and analyze documents.</p>
      </motion.div>
    </div>
  );
}
