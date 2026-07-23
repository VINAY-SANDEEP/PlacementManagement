import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { 
  Briefcase, 
  FileText, 
  Newspaper, 
  LogOut, 
  Plus, 
  LayoutDashboard, 
  FilePlus, 
  MessageSquarePlus, 
  ChevronRight,
  ExternalLink,
  Activity,
  Zap,
  TrendingUp,
  FolderPlus
} from "lucide-react";
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

      const combined = [
        ...placeRes.data.map(p => ({ id: p._id, title: p.companyName, type: "Placement", date: p.createdAt })),
        ...notesRes.data.map(n => ({ id: n._id, title: n.notesName, type: "Notes", date: n.createdAt })),
        ...newsRes.data.map(w => ({ id: w._id, title: w.title, type: "News", date: w.createdAt }))
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

  const getTypeBadge = (type) => {
    switch (type) {
      case "Placement":
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">Placement</span>;
      case "Notes":
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Notes</span>;
      case "News":
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">News</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row">
      
      {/* Sidebar Nav */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-semibold text-sm text-gray-900 block">Portal Admin</span>
                <span className="text-[11px] text-gray-500 font-medium">Management Console</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-6">
            <div>
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Main Menu</p>
              <div className="space-y-1">
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-indigo-50 text-indigo-700 font-medium text-sm border border-indigo-100 transition-all"
                >
                  <Activity className="h-4 w-4" />
                  <span>Overview</span>
                </Link>
                <Link 
                  to="/placements-admin" 
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium text-sm transition-all"
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Placements List</span>
                </Link>
              </div>
            </div>

            <div>
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Management</p>
              <div className="space-y-1">
                <Link 
                  to="/add-placement" 
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium text-sm transition-all"
                >
                  <FilePlus className="h-4 w-4 text-blue-600" />
                  <span>Add Placement</span>
                </Link>
                <Link 
                  to="/add-notes" 
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium text-sm transition-all"
                >
                  <FolderPlus className="h-4 w-4 text-emerald-600" />
                  <span>Add Notes</span>
                </Link>
                <Link 
                  to="/add-news" 
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium text-sm transition-all"
                >
                  <MessageSquarePlus className="h-4 w-4 text-amber-600" />
                  <span>Add News</span>
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-all text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Work Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto max-w-7xl">
        
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">System Overview</h1>
            <p className="text-gray-500 text-sm mt-1">Real-time metrics, platform usage summary and upload registry.</p>
          </div>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-gray-700 transition font-medium self-start sm:self-auto shadow-sm"
          >
            <span>Live Portal</span>
            <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
          </Link>
        </header>

        {/* Metrics Grid */}
        <section className="grid sm:grid-cols-3 gap-5">
          
          {/* Card 1 */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Placements</span>
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 tracking-tight">
                {loading ? <span className="inline-block w-8 h-6 rounded bg-gray-100 animate-pulse" /> : stats.placements}
              </span>
              <span className="text-xs text-gray-500">Active Drives</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Academic Notes</span>
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 tracking-tight">
                {loading ? <span className="inline-block w-8 h-6 rounded bg-gray-100 animate-pulse" /> : stats.notes}
              </span>
              <span className="text-xs text-gray-500">Resources</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">News Notices</span>
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                <Newspaper className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 tracking-tight">
                {loading ? <span className="inline-block w-8 h-6 rounded bg-gray-100 animate-pulse" /> : stats.news}
              </span>
              <span className="text-xs text-gray-500">Announcements</span>
            </div>
          </div>

        </section>

        {/* Quick Actions & Recent Uploads */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Quick Registry Actions */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-indigo-600" />
              <h3 className="font-semibold text-gray-900 text-base">Quick Registry Actions</h3>
            </div>
            
            <div className="grid gap-3 pt-1">
              <Link 
                to="/add-placement" 
                className="group flex items-center justify-between p-3.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-blue-50 text-blue-600">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm text-gray-700 group-hover:text-gray-900 transition">Post New Placement Drive</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link 
                to="/add-notes" 
                className="group flex items-center justify-between p-3.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-emerald-50 text-emerald-600">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm text-gray-700 group-hover:text-gray-900 transition">Upload Academic Notes</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link 
                to="/add-news" 
                className="group flex items-center justify-between p-3.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-amber-50 text-amber-600">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm text-gray-700 group-hover:text-gray-900 transition">Broadcast Notice Announcement</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              <h3 className="font-semibold text-gray-900 text-base">Recent Activity Logs</h3>
            </div>
            
            {loading ? (
              <div className="space-y-3 pt-1">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-12 rounded-lg bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : recentUploads.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-10 rounded-lg bg-gray-50 border border-dashed border-gray-200">
                No recent activity registered yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 pt-1">
                {recentUploads.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="space-y-1 truncate">
                      <span className="font-medium text-sm text-gray-900 block truncate">{item.title}</span>
                      <div className="flex items-center gap-2">
                        {getTypeBadge(item.type)}
                      </div>
                    </div>
                    <span className="text-gray-500 text-xs font-mono shrink-0">
                      {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
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