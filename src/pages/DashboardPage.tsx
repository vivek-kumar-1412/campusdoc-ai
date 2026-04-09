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
    <div className="space-y-8 max-w-6xl mx-auto">
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} {...fadeUp} transition={{ delay: i * 0.1 }}>
            <Card className="relative overflow-hidden bg-white/5 border-white/10 shadow-glass backdrop-blur-xl group hover:border-primary/50 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="flex items-center gap-4 p-6 relative z-10">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-inner">
                  <s.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">{s.value}</p>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
            <Link to={card.to} className="block h-full">
              <Card className="h-full group cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-glass hover:border-primary/40 bg-white/5 border-white/10 backdrop-blur-md overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <CardHeader className="pb-4 relative z-10 p-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground mb-4 shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform duration-500 ease-apple">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 px-6 pb-6 pt-0">
                  <CardDescription className="text-muted-foreground/80 leading-relaxed">{card.desc}</CardDescription>
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
