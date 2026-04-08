import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkedFieldModal } from "@/components/LinkedFieldModal";
import { DOCUMENT_TYPES, GeneratedDocument, UploadedTemplate } from "@/lib/store";
import { generateDocumentContent } from "@/lib/document-generator";
import { Sparkles, Download, Save, Link2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CreateDocumentPageProps {
  onSave: (doc: GeneratedDocument) => void;
  templates: UploadedTemplate[];
}

export default function CreateDocumentPage({ onSave, templates }: CreateDocumentPageProps) {
  const [startupName, setStartupName] = useState("");
  const [docType, setDocType] = useState("mou");
  const [projectDetails, setProjectDetails] = useState("");
  const [partiesInvolved, setPartiesInvolved] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [linkedModalOpen, setLinkedModalOpen] = useState(false);
  const [linkedField, setLinkedField] = useState("");

  const sharedFields = ["startupName", "partiesInvolved", "date", "amount"];

  const handleLinkedFieldChange = (field: string) => {
    if (sharedFields.includes(field) && generatedContent) {
      setLinkedField(field);
      setLinkedModalOpen(true);
    }
  };

  const handleGenerate = async () => {
    if (!startupName || !docType || !projectDetails) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsGenerating(true);
    // Simulate AI delay
    await new Promise((r) => setTimeout(r, 1500));
    const content = generateDocumentContent(docType, {
      startupName,
      projectDetails,
      partiesInvolved,
      date,
      amount,
    });
    setGeneratedContent(content);
    setIsGenerating(false);
    setIsEditing(true);
    toast.success("Document generated successfully!");
  };

  const handleSave = () => {
    const doc: GeneratedDocument = {
      id: crypto.randomUUID(),
      title: `${DOCUMENT_TYPES.find((t) => t.value === docType)?.label} - ${startupName}`,
      type: docType as GeneratedDocument["type"],
      content: generatedContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      status: "draft",
      projectId: startupName.toLowerCase().replace(/\s+/g, "-"),
    };
    onSave(doc);
    toast.success("Document saved!");
    // Reset
    setGeneratedContent("");
    setIsEditing(false);
    setStartupName("");
    setProjectDetails("");
    setPartiesInvolved("");
    setAmount("");
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${docType}-${startupName || "document"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Document downloaded!");
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Create Document</h2>
        <p className="text-sm text-muted-foreground">
          Fill in the details and let AI generate your document.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Document Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-medium flex items-center gap-1">
                  Startup Name
                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                    <Link2 className="h-2.5 w-2.5 mr-0.5" /> Linked
                  </Badge>
                </Label>
                <Input
                  value={startupName}
                  onChange={(e) => setStartupName(e.target.value)}
                  onBlur={() => handleLinkedFieldChange("startupName")}
                  placeholder="Your startup name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-medium">Document Type</Label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-medium">Project Details</Label>
                <Textarea
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  placeholder="Describe the project..."
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label className="text-xs font-medium flex items-center gap-1">
                  Parties Involved
                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                    <Link2 className="h-2.5 w-2.5 mr-0.5" /> Linked
                  </Badge>
                </Label>
                <Input
                  value={partiesInvolved}
                  onChange={(e) => setPartiesInvolved(e.target.value)}
                  onBlur={() => handleLinkedFieldChange("partiesInvolved")}
                  placeholder="Other parties"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium flex items-center gap-1">
                    Date
                    <Badge variant="outline" className="text-[10px] px-1 py-0">
                      <Link2 className="h-2.5 w-2.5 mr-0.5" /> Linked
                    </Badge>
                  </Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    onBlur={() => handleLinkedFieldChange("date")}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium flex items-center gap-1">
                    Amount (₹)
                    <Badge variant="outline" className="text-[10px] px-1 py-0">
                      <Link2 className="h-2.5 w-2.5 mr-0.5" /> Linked
                    </Badge>
                  </Label>
                  <Input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onBlur={() => handleLinkedFieldChange("amount")}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>
              </div>

              {templates.length > 0 && (
                <div>
                  <Label className="text-xs font-medium">Use Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Default template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      {templates.filter((t) => t.type === "template").map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {isGenerating ? "Generating..." : "Generate Document"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Preview</CardTitle>
              {generatedContent && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleDownload}>
                    <Download className="h-3.5 w-3.5 mr-1" /> Download
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-3.5 w-3.5 mr-1" /> Save
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {generatedContent ? (
                <Textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="min-h-[500px] font-mono text-xs leading-relaxed"
                  readOnly={!isEditing}
                />
              ) : (
                <div className="flex items-center justify-center h-[500px] text-muted-foreground text-sm border border-dashed rounded-lg">
                  Your generated document will appear here
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <LinkedFieldModal
        open={linkedModalOpen}
        onClose={() => setLinkedModalOpen(false)}
        fieldName={linkedField}
        onConfirm={(updateAll) => {
          setLinkedModalOpen(false);
          toast.success(
            updateAll ? "All linked documents updated" : "This document updated only"
          );
        }}
      />
    </div>
  );
}
