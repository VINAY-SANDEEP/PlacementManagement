import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { Search, FileText, Download, Eye, BookOpen, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";

export default function Notes({ darkMode, setDarkMode }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // PDF Preview modal state
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Error loading notes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique branches for selection filters
  const uniqueBranches = Array.from(new Set(notes.map((n) => n.branch).filter(Boolean)));
  
  // Apply filtering rules
  const filteredNotes = notes.filter((item) => {
    const matchSearch = item.notesName.toLowerCase().includes(search.toLowerCase()) ||
                        (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    const matchBranch = branchFilter === "" || item.branch === branchFilter;
    const matchSemester = semesterFilter === "" || item.semester.toString() === semesterFilter;
    return matchSearch && matchBranch && matchSemester;
  });

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNotes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNotes.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Title elements */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-emerald-500" />
            Class Notes & Syllabus
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
            Download or preview lecture slides, syllabus papers, and hand-written revision guides uploaded by teachers.
          </p>
        </div>

        {/* Filters panel */}
        <div className="glass p-6 rounded-2xl shadow-md grid md:grid-cols-12 gap-4 items-center">
          {/* Search box */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by notes name or description..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
            />
          </div>

          {/* Branch filter */}
          <div className="md:col-span-4">
            <select
              value={branchFilter}
              onChange={(e) => { setBranchFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
            >
              <option value="">All Branches</option>
              {uniqueBranches.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          {/* Semester filter */}
          <div className="md:col-span-3">
            <select
              value={semesterFilter}
              onChange={(e) => { setSemesterFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem.toString()}>Semester {sem}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-56 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : currentItems.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center text-slate-400">
            No notes found. Create a new query parameter stack.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentItems.map((item) => (
              <div
                key={item._id}
                className="glass rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-slate-100 dark:border-slate-850 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                      Sem {item.semester}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold uppercase">
                      {item.branch}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1">
                    {item.notesName}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 line-clamp-3">
                    {item.description || "Comprehensive syllabus coverage and module resources."}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  {item.pdf ? (
                    <>
                      <button
                        onClick={() => setPreviewPdfUrl(item.pdf)}
                        className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-250 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Preview</span>
                      </button>
                      <a
                        href={item.pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center transition"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </a>
                    </>
                  ) : (
                    <span className="w-full text-center text-xs text-slate-400 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      No attachments
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6">
            <div className="text-xs text-slate-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredNotes.length)} of {filteredNotes.length} resources
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
                      ? "bg-emerald-600 text-white"
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

        {/* PDF Modal Preview Dialog */}
        {previewPdfUrl && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <span className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-500" />
                  Notes Preview
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href={previewPdfUrl}
                    download
                    className="p-2 rounded-full bg-slate-100 hover:bg-slate-250 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-355 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                  <button
                    onClick={() => setPreviewPdfUrl(null)}
                    className="text-xs px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold transition"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-slate-800">
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
    </>
  );
}