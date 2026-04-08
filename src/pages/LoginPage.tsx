import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/lib/store";
import { FileText } from "lucide-react";

interface LoginPageProps {
  onLogin: (email: string, password: string, role: UserRole) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("startup");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) onLogin(email, password, role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">CampusDoc AI</h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered document automation
          </p>
        </div>

        <div className="border border-border rounded-xl p-6 bg-card">
          <h2 className="text-lg font-semibold mb-4">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-xs font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@startup.com"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Role</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  type="button"
                  size="sm"
                  variant={role === "startup" ? "default" : "outline"}
                  onClick={() => setRole("startup")}
                  className="flex-1"
                >
                  Startup User
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={role === "mentor" ? "default" : "outline"}
                  onClick={() => setRole("mentor")}
                  className="flex-1"
                >
                  Mentor / Admin
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              {isSignup ? "Sign Up" : "Log In"}
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-4">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-foreground font-medium underline underline-offset-2"
            >
              {isSignup ? "Log in" : "Sign up"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
