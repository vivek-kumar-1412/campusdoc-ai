import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GeneratedDocument, User, DOCUMENT_TYPES } from "@/lib/store";
import { FileText, Eye, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface MyDocumentsPageProps {
  documents: GeneratedDocument[];
  user: User;
  onUpdate: (id: string, updates: Partial<GeneratedDocument>) => void;
}

export default function MyDocumentsPage({ documents, user, onUpdate }: MyDocumentsPageProps) {
  const [viewDoc, setViewDoc] = useState<GeneratedDocument | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const isAdmin = user.role === "mentor";

  const statusColor: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    pending: "bg-accent text-accent-foreground",
    approved: "bg-primary text-primary-foreground",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">My Documents</h2>
        <p className="text-sm text-muted-foreground">
          {documents.length} document{documents.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
          <FileText className="h-10 w-10 mb-3" />
          <p className="text-sm">No documents yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {documents.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:shadow-sm transition-shadow">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{doc.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">
                          {DOCUMENT_TYPES.find((t) => t.value === doc.type)?.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          v{doc.version}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(doc.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={statusColor[doc.status]} variant="secondary">
                      {doc.status}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => {
                      setViewDoc(doc);
                      setEditContent(doc.content);
                    }}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    {isAdmin && doc.status !== "approved" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          onUpdate(doc.id, { status: "approved" });
                          toast.success("Document approved!");
                        }}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={!!viewDoc} onOpenChange={(open) => !open && setViewDoc(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] bg-background/95 backdrop-blur-xl border-white/10 shadow-glass">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {viewDoc?.title}
            </DialogTitle>
          </DialogHeader>
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[500px] font-mono text-sm bg-white/5 border-white/10 rounded-xl leading-relaxed resize-none focus-visible:ring-primary/50"
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setViewDoc(null)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (viewDoc) {
                onUpdate(viewDoc.id, { content: editContent });
                toast.success("Document updated successfully!");
                setViewDoc(null);
              }
            }}>
               Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
