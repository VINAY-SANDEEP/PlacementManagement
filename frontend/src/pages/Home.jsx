import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Briefcase, FileText, Newspaper, Search, ArrowRight, Calendar, Users, Award, GraduationCap } from "lucide-react";

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

  // Helper check for "NEW" badge (posted within 3 days)
  const isRecentlyPosted = (dateString) => {
    if (!dateString) return false;
    const postDate = new Date(dateString);
    const diffTime = Math.abs(new Date() - postDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  // Filtered lists based on simple search
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

      {/* Hero section with smooth gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-primary-900 text-white py-20 px-6 sm:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)]" />
        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sm font-medium border border-white/10">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              Academic Year 2026 Portal Live
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              Shape Your Career & <br />
              <span className="text-secondary-300">Excel Academically</span>
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl">
              Access real-time placement announcements, study syllabus notes, and official college notifications in one integrated hub.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/placements"
                className="px-6 py-3 rounded-xl bg-white text-primary-700 hover:bg-slate-100 font-semibold shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                View Placements
              </Link>
              <Link
                to="/notes"
                className="px-6 py-3 rounded-xl bg-primary-600/30 hover:bg-primary-600/50 text-white font-semibold border border-white/20 backdrop-blur-sm transition-all duration-200"
              >
                Download Notes
              </Link>
            </div>
          </div>
          <div className="hidden md:col-span-4 md:grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col justify-between h-32">
              <Briefcase className="h-8 w-8 text-secondary-300" />
              <div>
                <span className="block text-2xl font-bold">{placements.length}</span>
                <span className="text-xs text-blue-100">Jobs Posted</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col justify-between h-32 mt-6">
              <FileText className="h-8 w-8 text-amber-300" />
              <div>
                <span className="block text-2xl font-bold">{notes.length}</span>
                <span className="text-xs text-blue-100">Study Resources</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main search and tabs bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -translate-y-8">
        <div className="glass p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-lg">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search news, notes, placement drives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-primary-500 placeholder-slate-400 outline-none transition"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Link
              to="/placements"
              className="flex items-center gap-2 whitespace-nowrap bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition"
            >
              <Briefcase className="h-4 w-4" />
              <span>Jobs & Internships</span>
            </Link>
            <Link
              to="/notes"
              className="flex items-center gap-2 whitespace-nowrap bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition"
            >
              <FileText className="h-4 w-4" />
              <span>Class Notes</span>
            </Link>
            <Link
              to="/news"
              className="flex items-center gap-2 whitespace-nowrap bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/60 transition"
            >
              <Newspaper className="h-4 w-4" />
              <span>Announcements</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-20">
        
        {/* Latest Placement Notifications section */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary-500" />
                Latest Placement Drives
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Apply now for top tier tech opportunities
              </p>
            </div>
            <Link to="/placements" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All Placements <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-60 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : filteredPlacements.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center text-slate-400">
              No placement drives found matching search terms.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {filteredPlacements.map((item) => (
                <div
                  key={item._id}
                  className="glass rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-900 p-2 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                        <img
                          src={item.companyLogo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80"}
                          className="max-h-full max-w-full object-contain"
                          alt={item.companyName}
                        />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          item.campusType === "On Campus"
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                            : "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
                        }`}>
                          {item.campusType}
                        </span>
                        {isRecentlyPosted(item.createdAt) && (
                          <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-950 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {item.companyName}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 line-clamp-2">
                      {item.jobDescription || "Explore placement updates and job descriptions."}
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block">Package (CTC)</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{item.ctc || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Expected Date</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {item.expectedExamDate ? new Date(item.expectedExamDate).toLocaleDateString() : "TBA"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      to="/placements"
                      className="w-full text-center py-2.5 rounded-xl bg-slate-100 hover:bg-primary-600 hover:text-white dark:bg-slate-800 dark:hover:bg-primary-500 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-1"
                    >
                      <span>Explore Details</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Dual-Layout Notes and News sections */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Notes column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-6 w-6 text-emerald-500" />
                  Latest Class Notes
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Hand-written and digital notes compiled by semester
                </p>
              </div>
              <Link to="/notes" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                All Notes <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                ))}
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="glass rounded-2xl p-8 text-center text-slate-400">
                No syllabus notes available.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotes.map((item) => (
                  <div
                    key={item._id}
                    className="glass rounded-2xl p-5 shadow-sm hover:shadow-md transition flex items-center justify-between gap-4 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                        Sem {item.semester} • {item.branch}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">
                        {item.notesName}
                      </h3>
                      <p className="text-slate-400 text-xs truncate max-w-sm md:max-w-md">
                        {item.description || "No description provided."}
                      </p>
                    </div>
                    {item.pdf ? (
                      <a
                        href={item.pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition shrink-0"
                      >
                        PDF
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">No File</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* News column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Newspaper className="h-6 w-6 text-amber-500" />
                  Important Announcements
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Urgent alerts and college notices
                </p>
              </div>
              <Link to="/news" className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                More News <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                ))}
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="glass rounded-2xl p-8 text-center text-slate-400">
                No active announcements.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNews.map((item) => (
                  <div
                    key={item._id}
                    className={`glass rounded-2xl p-5 shadow-sm border transition flex flex-col gap-2 relative overflow-hidden ${
                      item.priority === "High"
                        ? "border-l-4 border-l-rose-500 border-slate-100 dark:border-slate-850"
                        : "border-slate-100 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        item.priority === "High"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-450"
                          : item.priority === "Medium"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-450"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-350"
                      }`}>
                        {item.priority} Priority
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.publishDate ? new Date(item.publishDate).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Premium Footer with brand credentials */}
      <footer className="border-t border-slate-100 dark:border-slate-900 bg-slate-100 dark:bg-slate-950 py-10 transition">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary-500" />
            <span className="font-bold text-slate-900 dark:text-white">College Placement & Student Portal</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Powered by Node.js, Cloudinary, and React. Built to streamline placement drives and study metrics.
          </p>
          <div className="text-[10px] text-slate-400">
            © 2026 EduPortal. All Rights Reserved.
          </div>
        </div>
      </footer>
    </>
  );
}