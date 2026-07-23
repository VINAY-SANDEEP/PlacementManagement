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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Student Portal
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 mx-auto">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Console</h1>
            <p className="text-gray-500 text-sm">
              Provide credentials to access placement management.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Admin Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Security Key
                </label>
                <span className="text-[11px] text-gray-400">Default: 12345</span>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <ShieldAlert className="h-4 w-4" />
              {loading ? "Authenticating Session..." : "Secure Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}