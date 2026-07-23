import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { Newspaper, Search, AlertCircle, Calendar, Flag, Bell, ChevronLeft, ChevronRight } from "lucide-react";

export default function News({ darkMode, setDarkMode }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const res = await API.get("/news");
      setNews(res.data);
    } catch (err) {
      console.error("Error loading news feed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filters application
  const filteredNews = news.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                        (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    const matchPriority = priorityFilter === "" || item.priority === priorityFilter;
    return matchSearch && matchPriority;
  });

  // Critical banner alert (highest priority recent news)
  const criticalAlert = news.find(n => n.priority === "High");

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* News title banner */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Newspaper className="h-8 w-8 text-amber-500" />
            Notice Board & Announcements
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
            Stay updated with current exams dates, exam schedules, curricular notices, and semester declarations.
          </p>
        </div>

        {/* Urgent Announcement alert banner */}
        {criticalAlert && (
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-5 flex items-start gap-4 animate-pulse-subtle">
            <div className="p-3 bg-rose-500 text-white rounded-xl">
              <Bell className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                Critical Notice
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {criticalAlert.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-350 text-sm">
                {criticalAlert.description}
              </p>
              {criticalAlert.publishDate && (
                <span className="text-[10px] text-slate-400 block pt-1">
                  Published: {new Date(criticalAlert.publishDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Filters and search box */}
        <div className="glass p-6 rounded-2xl shadow-md flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-lg">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-amber-500 outline-none text-sm transition"
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => { setPriorityFilter(""); setCurrentPage(1); }}
              className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                priorityFilter === ""
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              All Priorities
            </button>
            <button
              onClick={() => { setPriorityFilter("High"); setCurrentPage(1); }}
              className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                priorityFilter === "High"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455"
              }`}
            >
              High Only
            </button>
            <button
              onClick={() => { setPriorityFilter("Medium"); setCurrentPage(1); }}
              className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                priorityFilter === "Medium"
                  ? "bg-amber-500 text-white"
                  : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-455"
              }`}
            >
              Medium
            </button>
          </div>
        </div>

        {/* News Cards grid layout */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : currentItems.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center text-slate-400">
            No notices found matching details.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item) => (
              <div
                key={item._id}
                className={`glass rounded-2xl p-6 shadow-md border transition-all duration-300 flex flex-col justify-between hover:shadow-lg border-slate-100 dark:border-slate-850 ${
                  item.priority === "High"
                    ? "border-t-4 border-t-rose-500"
                    : item.priority === "Medium"
                    ? "border-t-4 border-t-amber-500"
                    : "border-t-4 border-t-slate-300 dark:border-t-slate-700"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      item.priority === "High"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-450"
                        : item.priority === "Medium"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-450"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-350"
                    }`}>
                      {item.priority} Priority
                    </span>
                    <span className="text-[10px] text-slate-450 dark:text-slate-400 font-semibold flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.publishDate ? new Date(item.publishDate).toLocaleDateString() : ""}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6">
            <div className="text-xs text-slate-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredNews.length)} of {filteredNews.length} announcements
            </div>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-2 rounded-lg bg-slate-150 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 disabled:opacity-50 transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    currentPage === i + 1
                      ? "bg-amber-600 text-white"
                      : "bg-slate-150 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-2 rounded-lg bg-slate-150 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 disabled:opacity-50 transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}