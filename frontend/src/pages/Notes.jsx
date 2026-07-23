import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { Search, FileText, Download, Eye, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

export default function Notes({ darkMode, setDarkMode }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
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

  const uniqueBranches = Array.from(new Set(notes.map((n) => n.branch).filter(Boolean)));

  const filteredNotes = notes.filter((item) => {
    const matchSearch =
      item.notesName.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    const matchBranch = branchFilter === "" || item.branch === branchFilter;
    const matchSemester = semesterFilter === "" || item.semester.toString() === semesterFilter;
    return matchSearch && matchBranch && matchSemester;
  });

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

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              Class Notes & Syllabus
            </h1>
            <p className="text-gray-500 text-sm max-w-xl">
              Download or preview lecture slides, syllabus papers, and revision guides uploaded by teachers.
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm grid md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by notes name or description..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition"
              />
            </div>

            <div className="md:col-span-4">
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
                value={semesterFilter}
                onChange={(e) => { setSemesterFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2.5 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition"
              >
                <option value="">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem.toString()}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-56 rounded-xl bg-white border border-gray-200 animate-pulse" />
              ))}
            </div>
          ) : currentItems.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-16 text-center text-gray-500 shadow-sm">
              No notes found. Adjust your filters or search query.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
                        Sem {item.semester}
                      </span>
                      <span className="text-xs text-gray-500 font-medium uppercase">
                        {item.branch}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-base line-clamp-1">
                      {item.notesName}
                    </h3>
                    <p className="text-gray-500 text-xs mt-2 line-clamp-3">
                      {item.description || "Comprehensive syllabus coverage and module resources."}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-100 flex gap-2">
                    {item.pdf ? (
                      <>
                        <button
                          onClick={() => setPreviewPdfUrl(item.pdf)}
                          className="flex-1 py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Preview</span>
                        </button>
                        <a
                          href={item.pdf}
                          target="_blank"
                          rel="noreferrer"
                          className="py-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium flex items-center justify-center transition"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      </>
                    ) : (
                      <span className="w-full text-center text-xs text-gray-400 py-1 bg-gray-100 rounded-lg">
                        No attachments
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <div className="text-xs text-gray-500">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredNotes.length)} of {filteredNotes.length} resources
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
                    Notes Preview
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