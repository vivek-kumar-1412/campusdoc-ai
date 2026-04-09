import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDocuments, GeneratedDocument } from "@/lib/store";
import { analyzeLegalRisksJSON, LegalRiskAnalysis } from "@/lib/openai";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert, ShieldCheck, AlertTriangle, Lightbulb, Loader2, FileSearch } from "lucide-react";
import { toast } from "sonner";

export default function LegalAnalysisPage() {
  const { documents } = useDocuments();
  const [selectedDocId, setSelectedDocId] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<LegalRiskAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!selectedDocId) {
      toast.error("Please select a document to analyze.");
      return;
    }

    const doc = documents.find(d => d.id === selectedDocId);
    if (!doc) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeLegalRisksJSON(doc.content);
      setAnalysisResult(result);
      toast.success("Legal analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze document. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "HIGH": return "text-destructive border-destructive/30 bg-destructive/10";
      case "MEDIUM": return "text-warning border-warning/30 bg-warning/10";
      case "LOW": return "text-success border-success/30 bg-success/10";
      default: return "";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "HIGH": return <ShieldAlert className="h-5 w-5 text-destructive" />;
      case "MEDIUM": return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "LOW": return <ShieldCheck className="h-5 w-5 text-success" />;
      default: return null;
    }
  };
  
  const highRiskCount = analysisResult?.clauses.filter(c => c.riskLevel === "HIGH").length || 0;
  const mediumRiskCount = analysisResult?.clauses.filter(c => c.riskLevel === "MEDIUM").length || 0;
  const lowRiskCount = analysisResult?.clauses.filter(c => c.riskLevel === "LOW").length || 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Legal Analysis <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-primary uppercase font-bold tracking-widest border border-primary/30 align-middle">Beta</span></h2>
        <p className="text-sm text-muted-foreground mt-1">
          AI-powered clause detection, risk assessment, and negotiation suggestions.
        </p>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-glass-sm p-6 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none opacity-50" />
        <CardContent className="p-0 relative z-10 flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-medium text-foreground">Select a Document</label>
            <Select value={selectedDocId} onValueChange={setSelectedDocId}>
              <SelectTrigger className="w-full bg-background/50 border-white/10 backdrop-blur-sm h-12 rounded-xl">
                <SelectValue placeholder="Choose a drafted or approved document..." />
              </SelectTrigger>
              <SelectContent>
                {documents.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>
                    {doc.title} ({doc.type.toUpperCase()})
                  </SelectItem>
                ))}
                {documents.length === 0 && (
                  <SelectItem value="none" disabled>
                    No documents found. Create one first.
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !selectedDocId}
            className="w-full sm:w-auto h-12 px-8 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Risks...
              </>
            ) : (
              <>
                <FileSearch className="mr-2 h-4 w-4" /> Run AI Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/5 border-destructive/20 shadow-glass backdrop-blur-md rounded-2xl">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">{highRiskCount}</p>
                    <p className="text-xs font-semibold text-destructive uppercase tracking-widest mt-1">High Risk</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-warning/20 shadow-glass backdrop-blur-md rounded-2xl">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-warning/10 border border-warning/20 text-warning">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">{mediumRiskCount}</p>
                    <p className="text-xs font-semibold text-warning uppercase tracking-widest mt-1">Medium Risk</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-success/20 shadow-glass backdrop-blur-md rounded-2xl">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-success/10 border border-success/20 text-success">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">{lowRiskCount}</p>
                    <p className="text-xs font-semibold text-success uppercase tracking-widest mt-1">Low Risk</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {analysisResult.clauses.map((clause, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="bg-white/5 border-white/10 shadow-glass backdrop-blur-md overflow-hidden rounded-2xl hover:border-white/20 transition-colors">
                    <CardHeader className="p-6 pb-4 flex flex-row items-start justify-between gap-4 space-y-0">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileSearch className="w-5 h-5 text-muted-foreground" />
                          {clause.sectionTitle}
                        </CardTitle>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border flex items-center gap-1.5 uppercase ${getRiskColor(clause.riskLevel)}`}>
                        {getRiskIcon(clause.riskLevel)}
                        {clause.riskLevel} RISK
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-4">
                      <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                        {clause.analysisText}
                      </p>
                      
                      {clause.aiSuggestion && (
                        <div className="mt-4 p-4 rounded-xl border border-primary/20 bg-primary/5 relative overflow-hidden group">
                          <div className="absolute inset-y-0 left-0 w-1 bg-primary group-hover:w-1.5 transition-all" />
                          <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">AI Suggestion</p>
                              <p className="text-sm text-foreground/90 font-medium">{clause.aiSuggestion}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {analysisResult.clauses.length === 0 && (
                <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/10">
                  <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground">No critical risk clauses detected by AI.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
