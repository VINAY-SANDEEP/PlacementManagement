import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../services/api";
import { LayoutDashboard, ArrowLeft, Save, Upload, FileText, Globe } from "lucide-react";
import { useToast } from "../App";

export default function EditPlacement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    companyName: "",
    eligibleBranches: "",
    eligibilityCriteria: "",
    campusType: "",
    jobDescription: "",
    expectedExamDate: "",
    ctc: "",
    formLink: "",
    surveyLink: ""
  });

  const [companyLogo, setCompanyLogo] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    loadPlacement();
  }, []);

  const loadPlacement = async () => {
    try {
      setFetching(true);
      const res = await API.get(`/placements/${id}`);
      setForm({
        ...res.data,
        eligibleBranches: Array.isArray(res.data.eligibleBranches)
          ? res.data.eligibleBranches.join(",")
          : res.data.eligibleBranches || ""
      });
    } catch (err) {
      console.error(err);
      showToast("Error loading placement drive metadata", "error");
    } finally {
      setFetching(false);
    }
  };

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const update = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(form).forEach(key => {
      data.append(key, form[key]);
    });

    if (companyLogo) data.append("companyLogo", companyLogo);
    if (pdf) data.append("pdf", pdf);

    try {
      await API.put(`/placements/${id}`, data);
      showToast("Placement drive updated successfully", "success");
      navigate("/placements-admin");
    } catch (err) {
      console.error(err);
      showToast("Error saving placement updates", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
          <span className="h-3 w-3 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-sm font-medium text-gray-600">Loading drive details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row">
      {/* Sidebar */}
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
            to="/placements-admin"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <header className="pb-6 border-b border-gray-200">
          <div className="flex items-center gap-2 text-gray-900">
            <Save className="h-5 w-5 text-indigo-600" />
            <h1 className="text-2xl font-bold tracking-tight">Edit Placement Drive</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">Modify details for {form.companyName || "this drive"}.</p>
        </header>

        <form onSubmit={update} className="max-w-5xl space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  required
                  value={form.companyName}
                  onChange={change}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Eligible Branches *</label>
                <input
                  type="text"
                  name="eligibleBranches"
                  required
                  value={form.eligibleBranches}
                  onChange={change}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Campus Type</label>
                <select
                  name="campusType"
                  value={form.campusType}
                  onChange={change}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition"
                >
                  <option>On Campus</option>
                  <option>Off Campus</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">CTC Package</label>
                <input
                  type="text"
                  name="ctc"
                  value={form.ctc}
                  onChange={change}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Expected Exam Date</label>
                <input
                  type="date"
                  name="expectedExamDate"
                  value={form.expectedExamDate ? form.expectedExamDate.substring(0, 10) : ""}
                  onChange={change}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Eligibility Criteria *</label>
                <textarea
                  name="eligibilityCriteria"
                  required
                  value={form.eligibilityCriteria}
                  rows="4"
                  onChange={change}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Job Description</label>
                <textarea
                  name="jobDescription"
                  value={form.jobDescription}
                  rows="4"
                  onChange={change}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition resize-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-indigo-600" />
                  Application Form URL
                </label>
                <input
                  type="url"
                  name="formLink"
                  value={form.formLink}
                  onChange={change}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-emerald-600" />
                  Survey / Registry URL
                </label>
                <input
                  type="url"
                  name="surveyLink"
                  value={form.surveyLink}
                  onChange={change}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Update Logo</label>
                <label className="flex flex-col items-center justify-center border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 px-4 py-6 rounded-lg cursor-pointer transition">
                  <Upload className="h-6 w-6 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500">
                    {companyLogo ? companyLogo.name : "Select image file"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCompanyLogo(e.target.files[0])}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-gray-400">Leave empty to keep the existing logo.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Update PDF Document</label>
                <label className="flex flex-col items-center justify-center border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 px-4 py-6 rounded-lg cursor-pointer transition">
                  <FileText className="h-6 w-6 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500">
                    {pdf ? pdf.name : "Select PDF document"}
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdf(e.target.files[0])}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-gray-400">Leave empty to keep the existing PDF.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Save className="h-4 w-4" />
              {loading ? "Saving changes..." : "Save Changes"}
            </button>

            <Link
              to="/placements-admin"
              className="px-6 py-3 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm border border-gray-300 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}