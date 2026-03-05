import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useUserStore } from "@/stores/userStore";
import { useAdminStore } from "@/stores/adminStore";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, ShieldCheck, User } from "lucide-react";
import logoMs from "@/assets/logo-ms.png";
import { cn } from "@/lib/utils";

type Role = "user" | "admin";

export default function Login() {
  const [role, setRole] = useState<Role>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const loginUser = useUserStore((s) => s.login);
  const loginAdmin = useAdminStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (role === "admin") {
      if (loginAdmin(email, password)) {
        toast.success("Welcome back, Admin!");
        navigate("/admin/dashboard");
      } else {
        toast.error("Invalid admin credentials");
      }
    } else {
      if (loginUser(email, password)) {
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid email or password");
      }
    }
  };

  return (
    <main className="pt-24 pb-16 md:pt-32 md:pb-24 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-4"
      >
        <div className="text-center mb-8">
          <img src={logoMs} alt="MS Salon" className="w-16 h-16 rounded-xl mx-auto mb-4 object-cover" />
          <h1 className="font-serif text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to your account</p>
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Role toggle */}
            <div className="flex rounded-xl bg-muted p-1 mb-6">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                  role === "user"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <User className="w-4 h-4" /> Customer
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                  role === "admin"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <ShieldCheck className="w-4 h-4" /> Admin
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  {role === "admin" ? "Username" : "Email"}
                </label>
                <Input
                  type={role === "admin" ? "text" : "email"}
                  placeholder={role === "admin" ? "admin" : "your@email.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Password</label>
                <div className="relative">
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPw(!showPw)}
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full rounded-full font-sans gap-2">
                <LogIn className="w-4 h-4" /> Sign In
              </Button>
            </form>

            {role === "user" && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary font-medium hover:underline">
                  Sign Up
                </Link>
              </div>
            )}

            <div className="mt-3 p-3 rounded-lg bg-muted text-xs text-muted-foreground text-center">
              {role === "admin" ? (
                <>Demo: <span className="font-mono">admin</span> / <span className="font-mono">admin123</span></>
              ) : (
                <>Demo: <span className="font-mono">priya@example.com</span> / <span className="font-mono">password123</span></>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
