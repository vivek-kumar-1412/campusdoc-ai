import { LayoutDashboard, FilePlus, FileText, FolderOpen, Clock, LogOut, ShieldAlert } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Legal Analysis", url: "/analysis", icon: ShieldAlert },
  { title: "Create Document", url: "/create", icon: FilePlus },
  { title: "My Documents", url: "/documents", icon: FileText },
  { title: "Templates", url: "/templates", icon: FolderOpen },
  { title: "History", url: "/history", icon: Clock },
];

interface AppSidebarProps {
  onLogout: () => void;
  userName?: string;
  userRole?: string;
}

export function AppSidebar({ onLogout, userName, userRole }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/30 bg-sidebar/80 backdrop-blur-xl">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/70 mb-2">
            <span className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img src="/logo.png" alt="DocuGen AI" className="h-6 w-6 rounded-md object-cover shadow-glass-sm relative z-10" />
              </div>
              {!collapsed && <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">DocuGen AI</span>}
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-white/5 hover:text-foreground relative group overflow-hidden"
                      activeClassName="bg-primary/10 text-primary hover:bg-primary/15 shadow-inset"
                    >
                      <item.icon className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                      {!collapsed && <span className="relative z-10">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="mb-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">{userName}</p>
            <p className="capitalize">{userRole}</p>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "Logout"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
