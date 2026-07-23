import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { Newspaper, Search, Calendar, Bell, ChevronLeft, ChevronRight } from "lucide-react";

export default function News({ darkMode, setDarkMode }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
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

  const filteredNews = news.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    const matchPriority = priorityFilter === "" || item.priority === priorityFilter;
    return matchSearch && matchPriority;
  });

  const criticalAlert = news.find(n => n.priority === "High");

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

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              <Newspaper className="h-8 w-8 text-indigo-600" />
              Notice Board & Announcements
            </h1>
            <p className="text-gray-500 text-sm max-w-xl">
              Stay updated with exam dates, schedules, curricular notices, and semester declarations.
            </p>
          </div>

          {criticalAlert && (
            <div className="bg-white border border-rose-200 rounded-xl p-5 flex items-start gap-4 shadow-sm">
              <div className="p-3 bg-rose-600 text-white rounded-lg">
                <Bell className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase">
                  Critical Notice
                </span>
                <h2 className="text-lg font-semibold text-gray-900">
                  {criticalAlert.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  {criticalAlert.description}
                </p>
                {criticalAlert.publishDate && (
                  <span className="text-[10px] text-gray-400 block pt-1">
                    Published: {new Date(criticalAlert.publishDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-lg">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => { setPriorityFilter(""); setCurrentPage(1); }}
                className={`flex-1 md:flex-initial px-4 py-2.5 rounded-lg text-xs font-medium transition border ${
                  priorityFilter === ""
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                All Priorities
              </button>
              <button
                onClick={() => { setPriorityFilter("High"); setCurrentPage(1); }}
                className={`flex-1 md:flex-initial px-4 py-2.5 rounded-lg text-xs font-medium transition border ${
                  priorityFilter === "High"
                    ? "bg-rose-600 text-white border-rose-600"
                    : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                }`}
              >
                High Only
              </button>
              <button
                onClick={() => { setPriorityFilter("Medium"); setCurrentPage(1); }}
                className={`flex-1 md:flex-initial px-4 py-2.5 rounded-lg text-xs font-medium transition border ${
                  priorityFilter === "Medium"
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                }`}
              >
                Medium
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 rounded-xl bg-white border border-gray-200 animate-pulse" />
              ))}
            </div>
          ) : currentItems.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-16 text-center text-gray-500 shadow-sm">
              No notices found matching details.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((item) => (
                <div
                  key={item._id}
                  className={`bg-white rounded-xl p-6 shadow-sm border transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
                    item.priority === "High"
                      ? "border-t-4 border-t-rose-500 border-gray-200"
                      : item.priority === "Medium"
                      ? "border-t-4 border-t-amber-500 border-gray-200"
                      : "border-t-4 border-t-gray-300 border-gray-200"
                  }`}
                >
                  <div className="space-y-3">
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
                      <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.publishDate ? new Date(item.publishDate).toLocaleDateString() : ""}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 text-lg">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <div className="text-xs text-gray-500">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredNews.length)} of {filteredNews.length} announcements
              </div>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      currentPage === i + 1
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}