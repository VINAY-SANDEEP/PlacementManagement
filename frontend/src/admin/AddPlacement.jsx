import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { LayoutDashboard, ArrowLeft, Plus, Upload, FileText, Globe } from "lucide-react";
import { useToast } from "../App";

export default function AddPlacement() {
  const [formData, setFormData] = useState({
    companyName: "",
    eligibleBranches: "",
    eligibilityCriteria: "",
    campusType: "On Campus",
    jobDescription: "",
    expectedExamDate: "",
    ctc: "",
    formLink: "",
    surveyLink: "",
  });

  const [companyLogo, setCompanyLogo] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.eligibleBranches || !formData.eligibilityCriteria) {
      showToast("Please fill all required fields", "warning");
      return;
    }

    setLoading(true);
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (companyLogo) data.append("companyLogo", companyLogo);
    if (pdf) data.append("pdf", pdf);

    try {
      await API.post("/placements", data);
      showToast("Placement added successfully to drive database", "success");
      navigate("/placements-admin");
    } catch (err) {
      console.error(err);
      showToast("Server error during placement creation", "error");
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

      {/* Form Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <header className="pb-6 border-b border-slate-850">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Plus className="h-6 w-6 text-primary-500" />
            Add Placement Drive
          </h1>
          <p className="text-slate-400 text-xs mt-1">Configure recruitment details and upload attachments</p>
        </header>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          <div className="glass p-6 md:p-8 rounded-2xl border border-white/5 shadow-md space-y-6">
            
            {/* Row 1: Company details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-350">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  required
                  placeholder="e.g. Google India"
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-white placeholder-slate-500 focus:border-primary-500 outline-none text-sm transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-350">Eligible Branches (Comma Separated) *</label>
                <input
                  type="text"
                  name="eligibleBranches"
                  required
                  placeholder="e.g. CSE, ECE, IT, EE"
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-white placeholder-slate-500 focus:border-primary-500 outline-none text-sm transition"
                />
              </div>
            </div>

            {/* Row 2: Campus Type & CTC */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-350">Campus Type</label>
                <select
                  name="campusType"
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-white focus:border-primary-500 outline-none text-sm transition"
                >
                  <option className="bg-slate-900">On Campus</option>
                  <option className="bg-slate-900">Off Campus</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-350">CTC Package</label>
                <input
                  type="text"
                  name="ctc"
                  placeholder="e.g. 12 LPA"
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-white placeholder-slate-500 focus:border-primary-500 outline-none text-sm transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-350">Expected Exam Date</label>
                <input
                  type="date"
                  name="expectedExamDate"
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-white focus:border-primary-500 outline-none text-sm transition"
                />
              </div>
            </div>

            {/* Row 3: Rich parameters details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-350">Eligibility Criteria *</label>
                <textarea
                  name="eligibilityCriteria"
                  required
                  placeholder="e.g. 7.5 CGPA with no active backlogs"
                  rows="4"
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-white placeholder-slate-500 focus:border-primary-500 outline-none text-sm transition resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-350">Job Description</label>
                <textarea
                  name="jobDescription"
                  placeholder="Describe role roles, responsibilities, job location..."
                  rows="4"
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-white placeholder-slate-500 focus:border-primary-500 outline-none text-sm transition resize-none"
                />
              </div>
            </div>

            {/* Row 4: Links */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-350 flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-blue-400" />
                  Application Form URL
                </label>
                <input
                  type="url"
                  name="formLink"
                  placeholder="https://example.com/apply"
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-white placeholder-slate-500 focus:border-primary-500 outline-none text-sm transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-350 flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-emerald-400" />
                  Survey / Registry URL
                </label>
                <input
                  type="url"
                  name="surveyLink"
                  placeholder="https://forms.gle/details"
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-white placeholder-slate-500 focus:border-primary-500 outline-none text-sm transition"
                />
              </div>
            </div>

            {/* Row 5: File uploads */}
            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-350">Company Logo (Image)</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-700 bg-slate-950/20 hover:bg-slate-950/45 px-4 py-6 rounded-xl cursor-pointer transition">
                    <Upload className="h-6 w-6 text-slate-500 mb-2" />
                    <span className="text-xs text-slate-400">
                      {companyLogo ? companyLogo.name : "Select Image logo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCompanyLogo(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-350">Job Attachment (PDF)</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-700 bg-slate-950/20 hover:bg-slate-950/45 px-4 py-6 rounded-xl cursor-pointer transition">
                    <FileText className="h-6 w-6 text-slate-500 mb-2" />
                    <span className="text-xs text-slate-400">
                      {pdf ? pdf.name : "Select PDF syllabus document"}
                    </span>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setPdf(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm transition disabled:opacity-50"
            >
              {loading ? "Uploading files to Cloudinary..." : "Register Placement Drive"}
            </button>
            <Link
              to="/placements-admin"
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