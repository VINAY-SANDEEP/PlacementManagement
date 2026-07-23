import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { LayoutDashboard, ArrowLeft, Plus, Upload, BookOpen } from "lucide-react";
import { useToast } from "../App";

export default function AddNotes() {
  const [notesName, setNotesName] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [description, setDescription] = useState("");
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    if (!notesName || !branch || !semester) {
      showToast("Please fill all required details", "warning");
      return;
    }

    setLoading(true);
    const form = new FormData();
    form.append("notesName", notesName);
    form.append("branch", branch);
    form.append("semester", semester);
    form.append("description", description);
    if (pdf) {
      form.append("pdf", pdf);
    }

    try {
      await API.post("/notes", form);
      showToast("Notes uploaded successfully to registry", "success");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      showToast("Failed to upload notes resource", "error");
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
            <BookOpen className="h-6 w-6 text-emerald-505" />
            Upload Class Notes
          </h1>
          <p className="text-slate-400 text-xs mt-1">Configure notes metadata and attach PDF documents</p>
        </header>

        <form onSubmit={submit} className="max-w-3xl space-y-6">
          <div className="glass p-6 md:p-8 rounded-2xl border border-white/5 shadow-md space-y-6">
            
            {/* Input fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-350">Notes Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Operating Systems"
                  value={notesName}
                  onChange={(e) => setNotesName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500 outline-none text-sm transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-350">Academic Department / Branch *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500 outline-none text-sm transition"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-350">Semester *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="8"
                  placeholder="1 - 8"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500 outline-none text-sm transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-350">PDF attachment</label>
                <label className="flex items-center justify-center border border-dashed border-slate-700 bg-slate-950/20 hover:bg-slate-950/45 px-4 py-2.5 rounded-xl cursor-pointer transition text-xs text-slate-400">
                  <Upload className="h-4 w-4 mr-2" />
                  <span>{pdf ? pdf.name : "Select PDF syllabus file"}</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdf(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-350">Brief Description</label>
              <textarea
                placeholder="Detail core modules, syllabus references, or unit reviews..."
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500 outline-none text-sm transition resize-none"
              />
            </div>

          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition disabled:opacity-50"
            >
              {loading ? "Uploading PDF to Cloudinary..." : "Upload Notes Resource"}
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