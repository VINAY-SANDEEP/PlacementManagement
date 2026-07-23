import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  LayoutDashboard,
  ArrowLeft,
  BookOpen,
  Upload,
  Save,
} from "lucide-react";
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
      showToast("Please fill all required fields", "warning");
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

      showToast("Notes uploaded successfully", "success");
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      showToast("Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}

      <aside className="hidden md:flex w-64 bg-white border-r shadow-sm flex-col">

        <div className="px-6 py-6 border-b">

          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Admin Panel
            </h2>
          </div>

        </div>

        <nav className="flex-1 p-5 space-y-2">

          <Link
            to="/dashboard"
            className="block px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
          >
            Dashboard
          </Link>

          <Link
            to="/dashboard"
            className="block px-4 py-3 rounded-lg bg-blue-50 text-blue-700 font-semibold"
          >
            Upload Notes
          </Link>

        </nav>

        <div className="p-5 border-t">

          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 py-3 border rounded-lg hover:bg-gray-100 font-medium"
          >
            <ArrowLeft size={18} />
            Back
          </Link>

        </div>

      </aside>

      {/* Main */}

      <div className="flex-1">

        {/* Header */}

        <div className="bg-white border-b px-10 py-6">

          <div className="flex items-center gap-3">

            <div className="bg-green-100 p-3 rounded-lg">
              <BookOpen className="text-green-600" />
            </div>

            <div>

              <h1 className="text-3xl font-bold text-gray-800">
                Upload Study Notes
              </h1>

              <p className="text-gray-500 mt-1">
                Upload subject notes and PDF resources for students.
              </p>

            </div>

          </div>

        </div>

        {/* Form */}

        <div className="p-10">

          <form
            onSubmit={submit}
            className="bg-white rounded-xl border shadow-sm p-8 max-w-5xl"
          >

            <h2 className="text-xl font-semibold text-gray-800 mb-8">
              Notes Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">

              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Notes Title
                </label>

                <input
                  type="text"
                  value={notesName}
                  onChange={(e) => setNotesName(e.target.value)}
                  placeholder="Operating Systems Unit-1"
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Branch
                </label>

                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="CSE"
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">

              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Semester
                </label>

                <input
                  type="number"
                  min={1}
                  max={8}
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Upload PDF
                </label>

                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 cursor-pointer hover:bg-gray-50 transition">

                  <Upload className="text-blue-600" size={20} />

                  <span className="text-gray-600 text-sm">
                    {pdf ? pdf.name : "Choose PDF File"}
                  </span>

                  <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={(e) => setPdf(e.target.files[0])}
                  />

                </label>

              </div>

            </div>

            <div className="mb-8">

              <label className="block mb-2 font-medium text-gray-700">
                Description
              </label>

              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a short description about these notes..."
                className="w-full border rounded-lg px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            <div className="flex justify-end gap-4">

              <Link
                to="/dashboard"
                className="px-6 py-3 border rounded-lg hover:bg-gray-100 font-medium"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                <Save size={18} />

                {loading
                  ? "Uploading..."
                  : "Upload Notes"}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}