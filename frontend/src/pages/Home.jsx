import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Briefcase, FileText, Newspaper, Search, ArrowRight, GraduationCap } from "lucide-react";

const API = "https://placementmanagement.onrender.com/api";

export default function Home({ darkMode, setDarkMode }) {
  const [placements, setPlacements] = useState([]);
  const [notes, setNotes] = useState([]);
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [placeRes, notesRes, newsRes] = await Promise.all([
        axios.get(`${API}/placements`),
        axios.get(`${API}/notes`),
        axios.get(`${API}/news`),
      ]);
      setPlacements(placeRes.data);
      setNotes(notesRes.data);
      setNews(newsRes.data);
    } catch (err) {
      console.error("Error fetching homepage data:", err);
    } finally {
      setLoading(false);
    }
  };

  const isRecentlyPosted = (dateString) => {
    if (!dateString) return false;
    const postDate = new Date(dateString);
    const diffTime = Math.abs(new Date() - postDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  const filteredPlacements = placements
    .filter(p => p.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 3);

  const filteredNotes = notes
    .filter(n => n.notesName.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 3);

  const filteredNews = news
    .filter(w => w.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 3);

  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-sm font-medium">
                <span className="h-2 w-2 rounded-full bg-indigo-600" />
                Academic Year 2026 Portal Live
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                Shape Your Career & <br />
                <span className="text-indigo-600">Excel Academically</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
                Access placement announcements, academic notes, and official college notifications in one reliable portal.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/placements"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-sm"
                >
                  View Placements
                </Link>
                <Link
                  to="/notes"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 transition"
                >
                  Download Notes
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <Briefcase className="h-8 w-8 text-indigo-600" />
                  <div className="mt-8">
                    <span className="block text-3xl font-bold text-gray-900">{placements.length}</span>
                    <span className="text-sm text-gray-500">Jobs Posted</span>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mt-6">
                  <FileText className="h-8 w-8 text-emerald-600" />
                  <div className="mt-8">
                    <span className="block text-3xl font-bold text-gray-900">{notes.length}</span>
                    <span className="text-sm text-gray-500">Study Resources</span>
                  </div>
                </div>

                <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <Newspaper className="h-8 w-8 text-amber-600" />
                  <div className="mt-8">
                    <span className="block text-3xl font-bold text-gray-900">{news.length}</span>
                    <span className="text-sm text-gray-500">Announcements</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and shortcuts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-lg">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search news, notes, placement drives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder-gray-400 outline-none transition"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Link
              to="/placements"
              className="flex items-center gap-2 whitespace-nowrap bg-indigo-50 text-indigo-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-100 transition border border-indigo-100"
            >
              <Briefcase className="h-4 w-4" />
              <span>Jobs & Internships</span>
            </Link>
            <Link
              to="/notes"
              className="flex items-center gap-2 whitespace-nowrap bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-100 transition border border-emerald-100"
            >
              <FileText className="h-4 w-4" />
              <span>Class Notes</span>
            </Link>
            <Link
              to="/news"
              className="flex items-center gap-2 whitespace-nowrap bg-amber-50 text-amber-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-100 transition border border-amber-100"
            >
              <Newspaper className="h-4 w-4" />
              <span>Announcements</span>
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-16">
        {/* Placements */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-indigo-600" />
                Latest Placement Drives
              </h2>
              <p className="text-gray-500 text-sm mt-1">Apply now for top opportunities.</p>
            </div>
            <Link to="/placements" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All Placements <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-60 rounded-xl bg-white border border-gray-200 animate-pulse" />
              ))}
            </div>
          ) : filteredPlacements.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500 shadow-sm">
              No placement drives found matching search terms.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {filteredPlacements.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-12 w-12 rounded-lg bg-gray-50 border border-gray-200 p-2 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.companyLogo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80"}
                          className="max-h-full max-w-full object-contain"
                          alt={item.companyName}
                        />
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                          item.campusType === "On Campus"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}>
                          {item.campusType}
                        </span>
                        {isRecentlyPosted(item.createdAt) && (
                          <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                            NEW
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.companyName}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {item.jobDescription || "Explore placement updates and job descriptions."}
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400 block">Package (CTC)</span>
                        <span className="font-semibold text-gray-900">{item.ctc || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Expected Date</span>
                        <span className="font-semibold text-gray-900">
                          {item.expectedExamDate ? new Date(item.expectedExamDate).toLocaleDateString() : "TBA"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      to="/placements"
                      className="w-full inline-flex items-center justify-center gap-1 py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
                    >
                      <span>Explore Details</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Notes and News */}
        <section className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-emerald-600" />
                  Latest Class Notes
                </h2>
                <p className="text-gray-500 text-sm mt-1">Hand-written and digital notes compiled by semester.</p>
              </div>
              <Link to="/notes" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                All Notes <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-24 rounded-xl bg-white border border-gray-200 animate-pulse" />
                ))}
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 shadow-sm">
                No syllabus notes available.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotes.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Sem {item.semester} • {item.branch}
                      </span>
                      <h3 className="font-semibold text-gray-900 text-base md:text-lg">
                        {item.notesName}
                      </h3>
                      <p className="text-gray-400 text-xs truncate max-w-sm md:max-w-md">
                        {item.description || "No description provided."}
                      </p>
                    </div>

                    {item.pdf ? (
                      <a
                        href={item.pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition shrink-0"
                      >
                        PDF
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">No File</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                  <Newspaper className="h-6 w-6 text-amber-600" />
                  Important Announcements
                </h2>
                <p className="text-gray-500 text-sm mt-1">Urgent alerts and college notices.</p>
              </div>
              <Link to="/news" className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1">
                More News <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-24 rounded-xl bg-white border border-gray-200 animate-pulse" />
                ))}
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 shadow-sm">
                No active announcements.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNews.map((item) => (
                  <div
                    key={item._id}
                    className={`bg-white rounded-xl p-5 shadow-sm border transition flex flex-col gap-2 ${
                      item.priority === "High"
                        ? "border-l-4 border-l-rose-500 border-gray-200"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase border ${
                        item.priority === "High"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : item.priority === "Medium"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}>
                        {item.priority} Priority
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {item.publishDate ? new Date(item.publishDate).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-xs line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <GraduationCap className="h-6 w-6 text-indigo-600" />
            <span className="font-semibold text-gray-900">College Placement & Student Portal</span>
          </div>
          <p className="text-xs text-gray-500">
            Powered by Node.js, Cloudinary, and React. Built to streamline placement drives and study metrics.
          </p>
          <div className="text-[10px] text-gray-400">
            © 2026 EduPortal. All Rights Reserved.
          </div>
        </div>
      </footer>
    </>
  );
}