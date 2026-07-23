import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { LayoutDashboard, ArrowLeft, Plus, Newspaper } from "lucide-react";
import { useToast } from "../App";

export default function AddNews() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    publishDate: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      showToast("Please fill all required announcement details", "warning");
      return;
    }

    setLoading(true);
    try {
      await API.post("/news", form);
      showToast("Announcement notice broadcasted successfully", "success");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      showToast("Failed to broadcast news notice", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Nav */}
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
          </nav>
        </div>
        <div className="pt-6 border-t border-slate-800">
          <Link to="/dashboard" className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Work Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <header className="pb-6 border-b border-slate-850">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-amber-505" />
            Add News notice
          </h1>
          <p className="text-slate-400 text-xs mt-1">Configure announcement broadcast message and set priorities</p>
        </header>

        <form onSubmit={submit} className="max-w-3xl space-y-6">
          <div className="glass p-6 md:p-8 rounded-2xl border border-white/5 shadow-md space-y-6">
            
            {/* Input fields */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-350">Notice Title *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Schedule for Mid-Term Exams Autumn 2026"
                value={form.title}
                onChange={change}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-white placeholder-slate-500 focus:border-amber-500 outline-none text-sm transition"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-350">Priority Level</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={change}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-white focus:border-amber-500 outline-none text-sm transition"
                >
                  <option className="bg-slate-900">High</option>
                  <option className="bg-slate-900">Medium</option>
                  <option className="bg-slate-900">Low</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-350">Publish Date</label>
                <input
                  type="date"
                  name="publishDate"
                  value={form.publishDate}
                  onChange={change}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-white focus:border-amber-500 outline-none text-sm transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-350">Announcement Details *</label>
              <textarea
                name="description"
                required
                placeholder="Provide detailed description regarding deadlines, reference PDFs, rules..."
                rows="5"
                value={form.description}
                onChange={change}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-white placeholder-slate-500 focus:border-amber-500 outline-none text-sm transition resize-none"
              />
            </div>

          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm transition disabled:opacity-50"
            >
              {loading ? "Publishing Broadcast..." : "Publish Broadcast Notice"}
            </button>
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition"
            >
              Cancel
            </Link>
          </div>

        </form>
      </main>
    </div>
  );
}