import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminStore } from "@/stores/adminStore";
import { Home, Lock } from "lucide-react";
import { toast } from "sonner";
import logoMs from "@/assets/logo-ms.png";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useAdminStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      toast.success("Welcome back, Admin!");
      navigate("/admin/dashboard");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img
            src={logoMs}
            alt="MS Salon & Academy"
            onClick={() => navigate("/")}
            className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover shadow-lg cursor-pointer"
          />
          <h1 className="font-serif text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1">
            MS Salon & Academy
          </p>
          <a
            className="text-sm text-muted-foreground mt-1 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Go to Store
          </a>
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-1 text-sm">
              <Home className="w-4 h-4" /> Site
            </Button>
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-card p-6 rounded-2xl border border-border shadow-sm"
        >
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" className="w-full rounded-xl gap-2">
            <Lock className="w-4 h-4" /> Sign In
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Demo: admin / admin123
        </p>
      </div>
    </div>
  );
}
