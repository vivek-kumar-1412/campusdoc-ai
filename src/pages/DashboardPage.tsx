import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus, FileText, FolderOpen, TrendingUp, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { User, GeneratedDocument } from "@/lib/store";

interface DashboardPageProps {
  user: User;
  documents: GeneratedDocument[];
}

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardPage({ user, documents }: DashboardPageProps) {
  const isAdmin = user.role === "mentor";
  const stats = [
    { label: "Total Documents", value: documents.length, icon: FileText },
    { label: "Drafts", value: documents.filter((d) => d.status === "draft").length, icon: Clock },
    { label: "Approved", value: documents.filter((d) => d.status === "approved").length, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">
          Welcome back, {user.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isAdmin
            ? "Review and manage startup documents."
            : "Create, edit, and manage your documents."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} {...fadeUp} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent">
                  <s.icon className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            title: "Create New Document",
            desc: "Generate a professional document with AI",
            icon: FilePlus,
            to: "/create",
          },
          {
            title: "View Documents",
            desc: "Browse and manage your documents",
            icon: FileText,
            to: "/documents",
          },
          {
            title: "Templates",
            desc: "Explore and upload document templates",
            icon: FolderOpen,
            to: "/templates",
          },
        ].map((card, i) => (
          <motion.div key={card.title} {...fadeUp} transition={{ delay: 0.3 + i * 0.1 }}>
            <Link to={card.to}>
              <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-foreground/20">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground mb-2 group-hover:scale-105 transition-transform">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{card.desc}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {isAdmin && (
        <motion.div {...fadeUp} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" /> Admin Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You have {documents.filter((d) => d.status === "pending").length} documents pending approval.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
