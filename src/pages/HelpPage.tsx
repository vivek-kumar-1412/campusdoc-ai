import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Help Center</h2>
        <p className="text-muted-foreground mt-2">Find answers, learn the basics, or chat with support.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                 <h4 className="font-medium text-sm">How do I auto-sync documents?</h4>
                 <p className="text-xs text-muted-foreground mt-1">Make an edit in the document viewer, and wait 1 second. The AI will prompt you to sync changes across all related documents.</p>
               </div>
               <div>
                 <h4 className="font-medium text-sm">What document types are supported?</h4>
                 <p className="text-xs text-muted-foreground mt-1">We currently support MoUs, Invoices, and Work Orders natively.</p>
               </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
           <Card>
            <CardHeader>
              <CardTitle>Basic Usage Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
               <ol className="list-decimal pl-4 space-y-2">
                 <li>Go to Platform &gt; Create Document</li>
                 <li>Fill in your project details and select a type.</li>
                 <li>Save the generated document to your workspace.</li>
                 <li>Go to View Documents to edit and auto-sync changes seamlessly.</li>
               </ol>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
