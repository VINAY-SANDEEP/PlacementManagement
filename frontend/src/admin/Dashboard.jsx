import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Briefcase, FileText, Newspaper, LogOut, Plus, LayoutDashboard, Settings, FilePlus, MessageSquarePlus, ChevronRight } from "lucide-react";
import { useToast } from "../App";

export default function Dashboard() {
  const [stats, setStats] = useState({
    placements: 0,
    notes: 0,
    news: 0,
  });
  const [recentUploads, setRecentUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [placeRes, notesRes, newsRes] = await Promise.all([
        API.get("/placements"),
        API.get("/notes"),
        API.get("/news"),
      ]);

      setStats({
        placements: placeRes.data.length,
        notes: notesRes.data.length,
        news: newsRes.data.length,
      });

      // Merge and sort for recent activity listing
      const combined = [
        ...placeRes.data.map(p => ({ id: p._id, title: p.companyName, type: "Placement Drive", date: p.createdAt })),
        ...notesRes.data.map(n => ({ id: n._id, title: n.notesName, type: "Notes Resource", date: n.createdAt })),
        ...newsRes.data.map(w => ({ id: w._id, title: w.title, type: "News Notice", date: w.createdAt }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

      setRecentUploads(combined);
    } catch (err) {
      console.error("Error fetching admin stats:", err);
      showToast("Error loading stats", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    showToast("Logged out successfully", "info");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar Nav */}
      <aside className="w-full md:w-64 bg-slate-950 p-6 flex flex-col justify-between border-r border-slate-800 shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary-500" />
            <span className="font-bold text-lg text-white">Admin Dashboard</span>
          </div>

          <nav className="space-y-1.5">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900 text-primary-400 font-semibold transition">
              <Settings className="h-4 w-4" />
              <span>Overview</span>
            </Link>
            <Link to="/placements-admin" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white transition">
              <Briefcase className="h-4 w-4" />
              <span>Placements List</span>
            </Link>
            <Link to="/add-placement" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white transition">
              <FilePlus className="h-4 w-4 text-blue-500" />
              <span>Add Placement</span>
            </Link>
            <Link to="/add-notes" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white transition">
              <FilePlus className="h-4 w-4 text-emerald-500" />
              <span>Add Notes</span>
            </Link>
            <Link to="/add-news" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white transition">
              <MessageSquarePlus className="h-4 w-4 text-amber-500" />
              <span>Add News</span>
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 mt-6 md:mt-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-650/10 hover:bg-rose-600 hover:text-white text-rose-400 transition text-sm font-semibold"
          >
            <LogOut className="h-4 w-4" />
            <span>Secure Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Work Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <header className="flex justify-between items-center pb-6 border-b border-slate-850">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">System Overview</h1>
            <p className="text-slate-400 text-xs mt-1">Metrics, analytics summaries and uploads registry</p>
          </div>
          <Link to="/" className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-350 transition font-semibold">
            View Live Portal
          </Link>
        </header>

        {/* Stats Grid widgets */}
        <section className="grid sm:grid-cols-3 gap-6">
          <div className="glass rounded-2xl p-6 flex items-center justify-between border border-white/5 shadow-md">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Placement Drives</span>
              <span className="block text-3xl font-extrabold text-white">{loading ? "..." : stats.placements}</span>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/10">
              <Briefcase className="h-6 w-6" />
            </div>
          </div>
          <div className="glass rounded-2xl p-6 flex items-center justify-between border border-white/5 shadow-md">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Academic Notes</span>
              <span className="block text-3xl font-extrabold text-white">{loading ? "..." : stats.notes}</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
              <FileText className="h-6 w-6" />
            </div>
          </div>
          <div className="glass rounded-2xl p-6 flex items-center justify-between border border-white/5 shadow-md">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">News Notices</span>
              <span className="block text-3xl font-extrabold text-white">{loading ? "..." : stats.news}</span>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/10">
              <Newspaper className="h-6 w-6" />
            </div>
          </div>
        </section>

        {/* Quick action buttons & Recent activity list */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Quick Upload Panels */}
          <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="font-bold text-white text-lg">Quick Registry Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <Link to="/add-placement" className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 hover:bg-slate-950 text-slate-300 hover:text-white transition border border-slate-800">
                <div className="flex items-center gap-3">
                  <Plus className="h-5 w-5 text-blue-500" />
                  <span className="font-medium text-sm">Post New Placement Drive</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </Link>
              <Link to="/add-notes" className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 hover:bg-slate-950 text-slate-300 hover:text-white transition border border-slate-800">
                <div className="flex items-center gap-3">
                  <Plus className="h-5 w-5 text-emerald-500" />
                  <span className="font-medium text-sm">Upload Academic Lecture Notes</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </Link>
              <Link to="/add-news" className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 hover:bg-slate-950 text-slate-300 hover:text-white transition border border-slate-800">
                <div className="flex items-center gap-3">
                  <Plus className="h-5 w-5 text-amber-500" />
                  <span className="font-medium text-sm">Broadcast Notice Announcement</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </Link>
            </div>
          </div>

          {/* Recent activities registry */}
          <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="font-bold text-white text-lg">Recent Registry Logs</h3>
            
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 rounded-xl bg-slate-800/40 animate-pulse" />
                ))}
              </div>
            ) : recentUploads.length === 0 ? (
              <div className="text-center text-slate-500 text-sm py-8">
                No items uploaded yet. Get started by uploading!
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {recentUploads.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold block text-slate-200 text-sm truncate max-w-xs">{item.title}</span>
                      <span className="text-slate-500 text-[10px]">{item.type}</span>
                    </div>
                    <span className="text-slate-400 font-medium">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}