import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldAlert, User, KeyRound, ArrowLeft, GraduationCap } from "lucide-react";
import { useToast } from "../App";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate slight loading response
    setTimeout(() => {
      if (username === "admin" && password === "12345") {
        localStorage.setItem("isAdmin", "true");
        showToast("Logged in successfully as Administrator", "success");
        navigate("/dashboard");
      } else {
        showToast("Invalid admin credential parameters", "error");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-600/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition">
          <ArrowLeft className="h-4 w-4" />
          Back to Student Portal
        </Link>

        <div className="glass backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-primary-600/10 border border-primary-500/20 text-primary-400">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Console</h1>
            <p className="text-slate-400 text-xs">
              Provide credentials to access college placement registries
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-350">Admin Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/50 text-white placeholder-slate-500 border border-white/5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-sm transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-350">Security Key</label>
                <span className="text-[10px] text-slate-500">Default: 12345</span>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/50 text-white placeholder-slate-500 border border-white/5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-sm transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-primary-650/20 transition-all duration-200"
            >
              {loading ? "Authenticating Session..." : "Secure Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}