import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, FilePlus, FileText, FolderOpen, Clock, 
  ShieldAlert, Bot, PenTool, FileTerminal, FileCheck2, LogOut 
} from "lucide-react";

const platformItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, desc: "Overview of your workspace" },
  { title: "Create Document", url: "/create", icon: FilePlus, desc: "Generate a professional document with AI" },
  { title: "View Documents", url: "/documents", icon: FileText, desc: "Browse and manage your documents" },
  { title: "Templates", url: "/templates", icon: FolderOpen, desc: "Explore and upload document templates" },
  { title: "History", url: "/history", icon: Clock, desc: "View activity logs and generations" },
  { title: "Legal Analysis", url: "/analysis", icon: ShieldAlert, desc: "Assess documentation for legal risks" },
];

const aiToolsItems = [
  { title: "Generate MoU", url: "/create?type=mou", icon: FileTerminal, desc: "Create a Memorandum of Understanding" },
  { title: "Generate Invoice", url: "/create?type=invoice", icon: FileText, desc: "Create a standard invoice" },
  { title: "Generate Work Order", url: "/create?type=work-order", icon: FileCheck2, desc: "Create an official Work Order" },
  { title: "Chat Assistant", url: "/chat", icon: Bot, desc: "Ask questions, get answers instantly" },
  { title: "Grammar Fixer", url: "/grammar", icon: PenTool, desc: "Correct grammar and tone seamlessly" },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string; icon: any; url: string; children: React.ReactNode }
>(({ className, title, icon: Icon, children, url, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={url}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-background rounded-md border border-border/50">
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

interface TopNavProps {
  onLogout: () => void;
  userName?: string;
  userRole?: string;
}

export function TopNav({ onLogout, userName, userRole }: TopNavProps) {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 mr-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm opacity-100 transition-opacity"></div>
              <img src="/logo.png" alt="DocuGen AI" className="h-7 w-7 rounded-md object-cover shadow-glass-sm relative z-10" />
            </div>
            <span className="font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent sm:inline-block">DocuGen AI</span>
          </Link>
          
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Platform</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {platformItems.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        url={item.url}
                        icon={item.icon}
                      >
                        {item.desc}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">AI Tools</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {aiToolsItems.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        url={item.url}
                        icon={item.icon}
                      >
                        {item.desc}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent h-10")}>
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/help">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent h-10")}>
                    Help
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-xs font-medium text-foreground">{userName}</span>
            <span className="text-[10px] text-muted-foreground capitalize">{userRole}</span>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline-block">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
