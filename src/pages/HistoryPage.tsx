import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GeneratedDocument, DOCUMENT_TYPES } from "@/lib/store";
import { Clock, FileText } from "lucide-react";

interface HistoryPageProps {
  documents: GeneratedDocument[];
}

export default function HistoryPage({ documents }: HistoryPageProps) {
  const sorted = [...documents].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Document History</h2>
        <p className="text-sm text-muted-foreground">
          Track all your document versions and changes
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
          <Clock className="h-10 w-10 mb-3" />
          <p className="text-sm">No history yet.</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-4">
            {sorted.map((doc, i) => (
              <motion.div
                key={doc.id + doc.version}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative pl-10"
              >
                <div className="absolute left-[14px] top-4 w-2 h-2 rounded-full bg-foreground" />
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {DOCUMENT_TYPES.find((t) => t.value === doc.type)?.label}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline">v{doc.version}</Badge>
                        <span>{new Date(doc.updatedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
