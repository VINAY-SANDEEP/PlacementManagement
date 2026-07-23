import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  LayoutDashboard,
  ArrowLeft,
  Newspaper,
  Save,
} from "lucide-react";
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
      showToast("Please fill all required fields", "warning");
      return;
    }

    setLoading(true);

    try {
      await API.post("/news", form);

      showToast("News published successfully", "success");

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      showToast("Failed to publish news", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}

      <aside className="w-64 bg-white border-r shadow-sm hidden md:flex flex-col">

        <div className="px-6 py-6 border-b">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" />
            <h2 className="font-bold text-xl text-gray-800">
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
            Add News
          </Link>

        </nav>

        <div className="p-5 border-t">

          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-gray-300 hover:bg-gray-100 font-medium"
          >
            <ArrowLeft size={18} />
            Back
          </Link>

        </div>

      </aside>

      {/* Content */}

      <div className="flex-1">

        {/* Header */}

        <div className="bg-white border-b px-10 py-6">

          <div className="flex items-center gap-3">

            <div className="bg-blue-100 p-3 rounded-lg">
              <Newspaper className="text-blue-600" />
            </div>

            <div>

              <h1 className="text-3xl font-bold text-gray-800">
                Create News Notice
              </h1>

              <p className="text-gray-500 mt-1">
                Publish announcements and important notices for students.
              </p>

            </div>

          </div>

        </div>

        {/* Form */}

        <div className="p-10">

          <form
            onSubmit={submit}
            className="bg-white rounded-xl shadow-sm border p-8 max-w-4xl"
          >

            <h2 className="text-xl font-semibold text-gray-800 mb-8">
              Announcement Information
            </h2>

            {/* Title */}

            <div className="mb-6">

              <label className="block mb-2 font-medium text-gray-700">
                Notice Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={change}
                placeholder="Enter notice title"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />

            </div>

            {/* Row */}

            <div className="grid md:grid-cols-2 gap-6 mb-6">

              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Priority
                </label>

                <select
                  name="priority"
                  value={form.priority}
                  onChange={change}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>

              </div>

              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Publish Date
                </label>

                <input
                  type="date"
                  name="publishDate"
                  value={form.publishDate}
                  onChange={change}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />

              </div>

            </div>

            {/* Description */}

            <div className="mb-8">

              <label className="block mb-2 font-medium text-gray-700">
                Description
              </label>

              <textarea
                rows={7}
                name="description"
                value={form.description}
                onChange={change}
                placeholder="Enter complete announcement..."
                className="w-full border rounded-lg px-4 py-3 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />

            </div>

            {/* Buttons */}

            <div className="flex justify-end gap-4">

              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 font-medium"
              >
                Cancel
              </Link>

              <button
                disabled={loading}
                type="submit"
                className="flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                <Save size={18} />

                {loading
                  ? "Publishing..."
                  : "Publish Notice"}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}