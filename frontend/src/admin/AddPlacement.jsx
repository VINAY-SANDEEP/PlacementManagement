// NOTE:
// This file uses the same logic from your original component.
// The UI has been redesigned into a clean, professional light-theme admin layout.
// Replace this comment with your existing handleSubmit logic if needed.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  LayoutDashboard,
  ArrowLeft,
  Building2,
  Upload,
  FileText,
  Save,
} from "lucide-react";
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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.companyName ||
      !formData.eligibleBranches ||
      !formData.eligibilityCriteria
    ) {
      showToast("Please fill all required fields", "warning");
      return;
    }

    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) =>
      data.append(key, formData[key])
    );

    if (companyLogo) data.append("companyLogo", companyLogo);
    if (pdf) data.append("pdf", pdf);

    try {
      await API.post("/placements", data);
      showToast("Placement created successfully", "success");
      navigate("/placements-admin");
    } catch (err) {
      console.error(err);
      showToast("Failed to create placement", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="hidden md:flex w-64 bg-white border-r shadow-sm flex-col">
        <div className="px-6 py-6 border-b">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" />
            <h2 className="font-bold text-xl text-gray-800">Admin Panel</h2>
          </div>
        </div>

        <nav className="flex-1 p-5 space-y-2">
          <Link to="/dashboard" className="block px-4 py-3 rounded-lg hover:bg-gray-100">
            Dashboard
          </Link>
          <Link to="/placements-admin" className="block px-4 py-3 rounded-lg bg-blue-50 text-blue-700 font-semibold">
            Placements
          </Link>
        </nav>

        <div className="p-5 border-t">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 border rounded-lg py-3 hover:bg-gray-100"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
        </div>
      </aside>

      <div className="flex-1">
        <div className="bg-white border-b px-10 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Building2 className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Add Placement Drive
              </h1>
              <p className="text-gray-500">
                Create and publish a new placement opportunity.
              </p>
            </div>
          </div>
        </div>

        <div className="p-10">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-8 max-w-6xl">
            <h2 className="text-xl font-semibold mb-8">Placement Details</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium">Company Name</label>
                <input name="companyName" onChange={handleChange} className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block mb-2 font-medium">Eligible Branches</label>
                <input name="eligibleBranches" onChange={handleChange} className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium">Campus Type</label>
                <select name="campusType" onChange={handleChange} className="w-full border rounded-lg px-4 py-3">
                  <option>On Campus</option>
                  <option>Off Campus</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">CTC</label>
                <input name="ctc" onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />
              </div>

              <div>
                <label className="block mb-2 font-medium">Expected Exam Date</label>
                <input type="date" name="expectedExamDate" onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium">Eligibility Criteria</label>
                <textarea rows="5" name="eligibilityCriteria" onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />
              </div>

              <div>
                <label className="block mb-2 font-medium">Job Description</label>
                <textarea rows="5" name="jobDescription" onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium">Application Form Link</label>
                <input type="url" name="formLink" onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />
              </div>

              <div>
                <label className="block mb-2 font-medium">Survey Link</label>
                <input type="url" name="surveyLink" onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <label className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center cursor-pointer hover:bg-gray-50">
                <Upload className="mb-2 text-blue-600" />
                <span>{companyLogo ? companyLogo.name : "Upload Company Logo"}</span>
                <input hidden type="file" accept="image/*" onChange={(e)=>setCompanyLogo(e.target.files[0])}/>
              </label>

              <label className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center cursor-pointer hover:bg-gray-50">
                <FileText className="mb-2 text-blue-600" />
                <span>{pdf ? pdf.name : "Upload Job PDF"}</span>
                <input hidden type="file" accept="application/pdf" onChange={(e)=>setPdf(e.target.files[0])}/>
              </label>
            </div>

            <div className="flex justify-end gap-4">
              <Link to="/placements-admin" className="px-6 py-3 border rounded-lg hover:bg-gray-100">
                Cancel
              </Link>

              <button type="submit" disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg">
                <Save size={18}/>
                {loading ? "Saving..." : "Register Placement"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
