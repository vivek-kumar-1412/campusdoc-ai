import { ChatBot } from "@/components/ChatBot";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@/lib/store";
import { useSmartAutoSyncObserver } from "@/hooks/useSmartAutoSync";
import { SmartSyncPopup } from "@/components/SmartSyncPopup";
import { TopNav } from "@/components/TopNav";

interface AppLayoutProps {
  user: User;
  onLogout: () => void;
}

export function AppLayout({ user, onLogout }: AppLayoutProps) {
  const location = useLocation();
  const {
    suggestion,
    popupAnchor,
    acceptSync,
    dismissSync,
    lastSyncAction,
    setLastSyncAction
  } = useSmartAutoSyncObserver();

  return (
    <div className="flex flex-col min-h-screen w-full bg-background/50">
      <TopNav onLogout={onLogout} userName={user.name} userRole={user.role} />
      
      <div className="flex-1 flex flex-col min-w-0 container max-w-7xl mx-auto px-4 lg:px-8">
        <main className="flex-1 py-6 overflow-auto">
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

      <ChatBot />
      <SmartSyncPopup
        suggestion={suggestion}
        anchor={popupAnchor}
        onAccept={acceptSync}
        onDismiss={dismissSync}
        lastSyncAction={lastSyncAction}
        onUndo={() => {
          if (lastSyncAction) lastSyncAction();
          setLastSyncAction(null);
        }}
      />
    </div>
  );
}

