export default function PlacementCard({ placement }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">

      <img
        src={placement.companyLogo}
        alt={placement.companyName}
        className="w-16 h-16 object-contain"
      />

      <h2 className="text-2xl font-bold mt-3">
        {placement.companyName}
      </h2>

      <p className="text-gray-500">
        {placement.jobDescription}
      </p>

      <div className="mt-3">

        <p>

          <strong>CTC :</strong>

          {placement.ctc}

        </p>

        <p>

          <strong>Campus :</strong>

          {placement.campusType}

        </p>

        <p>

          <strong>Exam :</strong>

          {placement.expectedExamDate}

        </p>

      </div>

      <div className="flex gap-3 mt-5">

        <a
          href={placement.pdf}
          target="_blank"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          View PDF
        </a>

        <a
          href={placement.formLink}
          target="_blank"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Apply
        </a>

      </div>

    </div>
  );
}