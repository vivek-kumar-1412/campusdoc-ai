import { motion } from "framer-motion";
import { CopyCheck, Sparkles, Target, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            AI-Powered Productivity <br /> for Everyone
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Create professional documents, automated invoices, and secure MoUs instantly. Premium tools at your fingertips.
          </p>
        </motion.div>
      </div>

      {/* Mission Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Target className="w-5 h-5" /> Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground leading-relaxed">
            We believe AI should make professional work accessible to everyone. Our goal is to
            provide premium AI tools completely integrated into your workflow, dramatically 
            cutting down the hours spent drafting, verifying, and syncing repetitive documentation 
            for students, researchers, startups, and casual users.
          </CardContent>
        </Card>
      </motion.div>

      {/* FAQ Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2 border-b border-border/40 pb-2">
          <Sparkles className="w-5 h-5 text-foreground" />
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Frequently Asked Questions</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">What exactly is DocuGen AI?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              DocuGen AI is an advanced workspace designed to instantly generate custom legal frameworks, business proposals, and administrative files using cutting-edge Language Models.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">How does the Smart Auto Sync work?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Just edit text in the Document Viewer! The AI engine constantly watches for your adjustments and will offer to automatically propagate those updates to every other linked document in your project instantly.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Are the generated documents legally binding?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              While our AI models use standard enterprise phrasing, the generated texts serve as highly functional drafts. You should always consult with qualified legal counsel before signing binding agreements.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Is my data secure?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Absolutely. Revisions and generated documents are saved securely within your private workspace. We do not use your proprietary project details or document inputs to train public language models.
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
