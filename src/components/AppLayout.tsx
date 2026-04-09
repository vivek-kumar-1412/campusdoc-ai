import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatBot } from "@/components/ChatBot";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@/lib/store";

interface AppLayoutProps {
  user: User;
  onLogout: () => void;
}

export function AppLayout({ user, onLogout }: AppLayoutProps) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar onLogout={onLogout} userName={user.name} userRole={user.role} />
        <div className="flex-1 flex flex-col min-w-0 bg-background/50">
          <header className="h-14 flex items-center border-b border-border/40 px-4 bg-background/40 backdrop-blur-xl sticky top-0 z-10 transition-colors">
            <SidebarTrigger className="mr-4 hover:bg-white/10 transition-colors" />
            <img src="/logo.png" alt="" className="h-7 w-7 rounded-md object-cover shadow-glass-sm" aria-hidden="true" />
            <h1 className="text-sm font-semibold tracking-tight ml-2 text-foreground">DocuGen AI</h1>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
      <ChatBot />
    </SidebarProvider>
  );
}

