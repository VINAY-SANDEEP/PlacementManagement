export default function PlacementCard({ placement }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition hover:shadow-md hover:border-gray-300">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src={placement.companyLogo}
              alt={placement.companyName}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {placement.companyName}
            </h2>
            <p className="text-sm text-gray-500 mt-1 line-clamp-3">
              {placement.jobDescription}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2 text-sm text-gray-700">
          <p className="flex justify-between gap-4">
            <span className="text-gray-500">CTC</span>
            <span className="font-medium text-gray-900">{placement.ctc || "N/A"}</span>
          </p>
          <p className="flex justify-between gap-4">
            <span className="text-gray-500">Campus</span>
            <span className="font-medium text-gray-900">{placement.campusType || "N/A"}</span>
          </p>
          <p className="flex justify-between gap-4">
            <span className="text-gray-500">Exam</span>
            <span className="font-medium text-gray-900">
              {placement.expectedExamDate ? new Date(placement.expectedExamDate).toLocaleDateString("en-IN") : "N/A"}
            </span>
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={placement.pdf}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
          >
            View PDF
          </a>

          <a
            href={placement.formLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
          >
            Apply
          </a>
        </div>
      </div>
    </div>
  );
}