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
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0">
        <div>
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-semibold text-sm text-gray-900 block">Admin Console</span>
                <span className="text-[11px] text-gray-500 font-medium">Placement Management</span>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-6">
            <div>
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Main Menu</p>
              <div className="space-y-1">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium text-sm transition-all"
                >
                  <span>Overview</span>
                </Link>
                <Link
                  to="/placements-admin"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-indigo-50 text-indigo-700 font-medium text-sm border border-indigo-100 transition-all"
                >
                  <span>Placements List</span>
                </Link>
              </div>
            </div>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <Link
            to="/dashboard"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Main List Table Area */}
      <main className="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-gray-900">
              <Briefcase className="h-6 w-6 text-indigo-600" />
              <h1 className="text-2xl font-bold tracking-tight">Manage Placement Drives</h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">Add, update or terminate active corporate drives.</p>
          </div>
          <Link
            to="/add-placement"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Drive</span>
          </Link>
        </header>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 rounded-lg bg-white border border-gray-200 animate-pulse" />
            ))}
          </div>
        ) : placements.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-16 text-center text-gray-500 shadow-sm">
            <ShieldAlert className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium">No placements found.</p>
            <p className="text-xs text-gray-400 mt-1">Create a placement drive to start listing!</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">CTC Package</th>
                    <th className="px-6 py-4">Drive Type</th>
                    <th className="px-6 py-4">Branches</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {placements.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="h-10 w-10 bg-white rounded-lg p-1 border border-gray-200 shrink-0 flex items-center justify-center">
                          <img
                            src={item.companyLogo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80"}
                            alt={item.companyName}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <span className="font-semibold text-gray-900">{item.companyName}</span>
                      </td>
                      <td className="px-6 py-4 font-medium">{item.ctc || "N/A"}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          item.campusType === "On Campus"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-purple-50 text-purple-700 border border-purple-200"
                        }`}>
                          {item.campusType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {item.eligibleBranches?.map(b => (
                            <span key={b} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                              {b}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/edit-placement/${item._id}`}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => deletePlacement(item._id)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
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