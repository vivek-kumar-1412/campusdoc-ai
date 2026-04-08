import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadedTemplate } from "@/lib/store";
import { FolderOpen, Upload, FileText, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const defaultTemplates = [
  { id: "default-mou", name: "Standard MoU", type: "template" as const, fileType: "docx" as const, uploadedAt: "2024-01-01" },
  { id: "default-invoice", name: "Professional Invoice", type: "template" as const, fileType: "docx" as const, uploadedAt: "2024-01-01" },
  { id: "default-wo", name: "Work Order Template", type: "template" as const, fileType: "docx" as const, uploadedAt: "2024-01-01" },
  { id: "default-po", name: "Purchase Order Template", type: "template" as const, fileType: "docx" as const, uploadedAt: "2024-01-01" },
];

interface TemplatesPageProps {
  templates: UploadedTemplate[];
  onAddTemplate: (t: UploadedTemplate) => void;
}

export default function TemplatesPage({ templates, onAddTemplate }: TemplatesPageProps) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [templateType, setTemplateType] = useState<"template" | "reference">("template");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<string>("");

  const allTemplates = [...defaultTemplates, ...templates];

  const handleUpload = () => {
    if (!fileName) {
      toast.error("Please enter a file name");
      return;
    }
    onAddTemplate({
      id: crypto.randomUUID(),
      name: fileName,
      type: templateType,
      fileType: "docx",
      uploadedAt: new Date().toISOString(),
    });
    setUploadOpen(false);
    setFileName("");
    toast.success("Template uploaded successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Templates</h2>
          <p className="text-sm text-muted-foreground">
            Default and custom document templates
          </p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Upload className="h-4 w-4 mr-2" /> Upload Template
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allTemplates.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="hover:shadow-sm transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t.fileType.toUpperCase()} • {new Date(t.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {t.type}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => {
                    setPreviewTemplate(t.name);
                    setPreviewOpen(true);
                  }}
                >
                  <Eye className="h-3.5 w-3.5 mr-1" /> Preview
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium">File Name</Label>
              <Input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="My Custom Template"
                className="mt-1"
              />
            </div>
            <div className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="text-center">
                <Upload className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground">
                  Drop DOCX/PDF or click to upload
                </p>
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium">Template Type</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  type="button"
                  size="sm"
                  variant={templateType === "template" ? "default" : "outline"}
                  onClick={() => setTemplateType("template")}
                  className="flex-1"
                >
                  Use as Template
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={templateType === "reference" ? "default" : "outline"}
                  onClick={() => setTemplateType("reference")}
                  className="flex-1"
                >
                  Use as Reference
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{previewTemplate}</DialogTitle>
          </DialogHeader>
          <div className="border rounded-lg p-6 min-h-[300px] flex items-center justify-center text-muted-foreground text-sm">
            <div className="text-center">
              <FolderOpen className="h-8 w-8 mx-auto mb-2" />
              <p>Template preview</p>
              <p className="text-xs mt-1">This template will be used for document structure and formatting.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
