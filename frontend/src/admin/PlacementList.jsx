import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { Briefcase, Plus, Trash2, Edit2, ShieldAlert, ArrowLeft, LayoutDashboard } from "lucide-react";
import { useToast } from "../App";

export default function PlacementList() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    getPlacements();
  }, []);

  const getPlacements = async () => {
    try {
      setLoading(true);
      const res = await API.get("/placements");
      setPlacements(res.data);
    } catch (err) {
      console.error(err);
      showToast("Error retrieving placement registries", "error");
    } finally {
      setLoading(false);
    }
  };

  const deletePlacement = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this placement drive registration?");
    if (!ok) return;

    try {
      await API.delete(`/placements/${id}`);
      showToast("Placement drive removed from live feeds", "success");
      getPlacements();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete placement drive", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-950 p-6 flex flex-col justify-between border-r border-slate-800 shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary-500" />
            <span className="font-bold text-lg text-white">Admin Console</span>
          </div>
          <nav className="space-y-1.5">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white transition">
              Overview
            </Link>
            <Link to="/placements-admin" className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900 text-primary-400 font-semibold transition">
              Placements List
            </Link>
          </nav>
        </div>
        <div className="pt-6 border-t border-slate-800">
          <Link to="/dashboard" className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Main List Table Area */}
      <main className="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-850">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Briefcase className="h-7 w-7 text-blue-500" />
              Manage Placement Drives
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Add, update or terminate active corporate drives
            </p>
          </div>
          <Link
            to="/add-placement"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-primary-650/10"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Drive</span>
          </Link>
        </header>

        {/* Table data panels */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 rounded-xl bg-slate-850 animate-pulse" />
            ))}
          </div>
        ) : placements.length === 0 ? (
          <div className="glass p-16 text-center text-slate-500 rounded-2xl border border-white/5">
            No placements found. Create a placement drive to start listing!
          </div>
        ) : (
          <div className="glass rounded-2xl border border-white/5 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs text-slate-450 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">CTC Package</th>
                    <th className="px-6 py-4">Drive Type</th>
                    <th className="px-6 py-4">Branches</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {placements.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-850/40 transition">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="h-10 w-10 bg-white dark:bg-slate-900 rounded-lg p-1 border border-slate-800 shrink-0 flex items-center justify-center">
                          <img
                            src={item.companyLogo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80"}
                            alt={item.companyName}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <span className="font-semibold text-white">{item.companyName}</span>
                      </td>
                      <td className="px-6 py-4 font-medium">{item.ctc || "N/A"}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          item.campusType === "On Campus"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/10"
                            : "bg-purple-500/10 text-purple-400 border border-purple-500/10"
                        }`}>
                          {item.campusType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {item.eligibleBranches?.map(b => (
                            <span key={b} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-850 text-slate-400">
                              {b}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/edit-placement/${item._id}`}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white transition"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => deletePlacement(item._id)}
                            className="p-1.5 rounded-lg bg-rose-650/10 hover:bg-rose-600 text-rose-400 hover:text-white transition"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}