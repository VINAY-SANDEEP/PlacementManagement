import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { Search, Briefcase, Download, ExternalLink, FileText, ChevronLeft, ChevronRight } from "lucide-react";

export default function Placements({ darkMode, setDarkMode }) {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [campusFilter, setCampusFilter] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);

  useEffect(() => {
    loadPlacements();
  }, []);

  const loadPlacements = async () => {
    try {
      setLoading(true);
      const res = await API.get("/placements");
      setPlacements(res.data);
    } catch (err) {
      console.error("Error loading placements:", err);
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

  const uniqueBranches = Array.from(
    new Set(
      placements.reduce((acc, curr) => {
        if (Array.isArray(curr.eligibleBranches)) {
          return [...acc, ...curr.eligibleBranches];
        }
        return acc;
      }, [])
    )
  );

  const filteredPlacements = placements
    .filter((item) => {
      const matchSearch =
        item.companyName.toLowerCase().includes(search.toLowerCase()) ||
        (item.jobDescription && item.jobDescription.toLowerCase().includes(search.toLowerCase()));
      const matchBranch =
        branchFilter === "" ||
        (Array.isArray(item.eligibleBranches) &&
          item.eligibleBranches.some((b) =>
            b.toLowerCase().includes(branchFilter.toLowerCase())
          ));
      const matchCampus = campusFilter === "" || item.campusType === campusFilter;
      return matchSearch && matchBranch && matchCampus;
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      const parseCTC = (ctcText) => {
        const match = ctcText?.match(/(\d+(\.\d+)?)/);
        return match ? parseFloat(match[0]) : 0;
      };
      return parseCTC(b.ctc) - parseCTC(a.ctc);
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPlacements.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPlacements.length / itemsPerPage);

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
              <Briefcase className="h-8 w-8 text-indigo-600" />
              Placement Opportunities
            </h1>
            <p className="text-gray-500 text-sm max-w-xl">
              Browse and apply to ongoing campus drives, off‑campus referrals, and summer internship drives.
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm grid md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-4 relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={branchFilter}
                onChange={(e) => { setBranchFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2.5 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition"
              >
                <option value="">All Branches</option>
                {uniqueBranches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={campusFilter}
                onChange={(e) => { setCampusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2.5 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition"
              >
                <option value="">All Drive Types</option>
                <option value="On Campus">On Campus</option>
                <option value="Off Campus">Off Campus</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2.5 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition"
              >
                <option value="latest">Sort by: Latest</option>
                <option value="package">Sort by: CTC Package</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-xl bg-white border border-gray-200 animate-pulse" />
              ))}
            </div>
          ) : currentItems.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-16 text-center text-gray-500 shadow-sm">
              No drives match the filtered parameters. Try revising your selections.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-14 w-14 rounded-lg bg-gray-50 border border-gray-200 p-2 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.companyLogo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80"}
                          className="max-h-full max-w-full object-contain"
                          alt={item.companyName}
                        />
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase border ${
                          item.campusType === "On Campus"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}>
                          {item.campusType}
                        </span>
                        {isRecentlyPosted(item.createdAt) && (
                          <span className="bg-rose-500 text-white text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
                            NEW
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900">
                      {item.companyName}
                    </h3>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.eligibleBranches?.map((branch) => (
                        <span
                          key={branch}
                          className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200 font-medium"
                        >
                          {branch}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-500 text-xs mt-3 line-clamp-3">
                      {item.jobDescription || "Explore placement updates and job descriptions."}
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">CTC Package:</span>
                        <span className="font-semibold text-gray-900">
                          {item.ctc || "Best in Industry"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Eligibility:</span>
                        <span className="font-semibold text-gray-900 text-right line-clamp-1">
                          {item.eligibilityCriteria || "Refer Attached Doc"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expected Exam:</span>
                        <span className="font-semibold text-gray-900">
                          {item.expectedExamDate
                            ? new Date(item.expectedExamDate).toLocaleDateString()
                            : "To Be Decided"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    {item.pdf && (
                      <button
                        onClick={() => setPreviewPdfUrl(item.pdf)}
                        className="flex-1 py-2 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs transition flex items-center justify-center gap-1"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Details</span>
                      </button>
                    )}
                    {item.formLink && (
                      <a
                        href={item.formLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition flex items-center justify-center gap-1"
                      >
                        <span>Apply</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <div className="text-xs text-gray-500">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPlacements.length)} of{" "}
                {filteredPlacements.length} placements
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

          {previewPdfUrl && (
            <div className="fixed inset-0 z-50 bg-gray-900/70 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col shadow-xl">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <span className="font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    PDF Viewer
                  </span>
                  <div className="flex items-center gap-3">
                    <a
                      href={previewPdfUrl}
                      download
                      className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 text-xs font-medium flex items-center gap-1 transition"
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Download</span>
                    </a>
                    <button
                      onClick={() => setPreviewPdfUrl(null)}
                      className="text-xs px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
                <div className="flex-1 bg-gray-100">
                  <iframe
                    src={`${previewPdfUrl}#view=FitH`}
                    className="w-full h-full border-none"
                    title="PDF Attachment Viewer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}