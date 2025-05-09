import { Link } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../../sidebar";
import candidates from "../../../../src/data/candidates.json";

function Applications() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");

  // Get unique statuses and positions for filter options
  const statusOptions = [...new Set(candidates.map((c) => c.status))];
  const positionOptions = [...new Set(candidates.map((c) => c.position))];

  const filteredCandidates = candidates.filter((candidate) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      candidate.name.toLowerCase().includes(query) ||
      candidate.email.toLowerCase().includes(query) ||
      candidate.position.toLowerCase().includes(query) ||
      candidate.status.toLowerCase().includes(query);

    const matchesStatus = selectedStatus
      ? candidate.status === selectedStatus
      : true;

    const matchesPosition = selectedPosition
      ? candidate.position === selectedPosition
      : true;

    return matchesSearch && matchesStatus && matchesPosition;
  });

  const openModal = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      {/* Main Content - Theme Matched to Dashboard */}
      <div className="ml-64 flex-1 min-h-screen w-[calc(100%-16rem)] bg-gradient from-blue-50 to-blue-100 p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Applications
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-blue-600">Last updated: Today</span>
            <span className="text-blue-400">•</span>
            <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
              25 total applications
            </span>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-8 flex gap-4 items-center">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl">
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-3.5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Status Filter */}
          <div className="relative w-40">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-3 pr-8 py-3 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-blue-900 appearance-none"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Position Filter */}
          <div className="relative w-48">
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full pl-3 pr-8 py-3 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-blue-900 appearance-none"
            >
              <option value="">All Positions</option>
              {positionOptions.map((position, index) => (
                <option key={index} value={position}>
                  {position}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                {["Candidate", "Position", "Date", "Status", ""].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-sm font-semibold text-blue-900 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-100">
              {filteredCandidates.map((candidate, index) => (
                <tr key={index} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-blue-900">
                        {candidate.name}
                      </span>
                      <span className="text-sm text-blue-500">
                        {candidate.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-blue-900">
                        {candidate.position}
                      </span>
                      <span className="text-sm text-blue-500">ENG-001</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-blue-900">2023-08-15</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openModal(candidate)}
                      className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Candidate Details Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-blue-900">
                    {selectedCandidate?.name}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-blue-900 mb-3">
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-blue-500">Email</p>
                        <p className="text-blue-900">
                          {selectedCandidate?.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-500">Location</p>
                        <p className="text-blue-900">
                          {selectedCandidate?.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-500">Experience</p>
                        <p className="text-blue-900">
                          {selectedCandidate?.experience}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div>
                    <h4 className="text-lg font-semibold text-blue-900 mb-3">
                      Application Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-blue-500">Position</p>
                        <p className="text-blue-900">
                          {selectedCandidate?.position}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-500">Applied Date</p>
                        <p className="text-blue-900">
                          {selectedCandidate?.date}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-500">Status</p>
                        <p className="text-blue-900">
                          {selectedCandidate?.status}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-500">Job ID</p>
                        <p className="text-blue-900">
                          {selectedCandidate?.jobId}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="text-lg font-semibold text-blue-900 mb-3">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate?.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h4 className="text-lg font-semibold text-blue-900 mb-3">
                      Application Timeline
                    </h4>
                    <div className="space-y-4">
                      {selectedCandidate?.timeline?.map((event, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4"
                        >
                          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="text-sm text-blue-900">
                              {event.date}
                            </p>
                            <p className="text-sm text-blue-500">
                              {event.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resume */}
                  <div>
                    <h4 className="text-lg font-semibold text-blue-900 mb-3">
                      Resume
                    </h4>
                    <button className="text-blue-600 hover:text-blue-800 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {selectedCandidate?.resume}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="mt-6 bg-blue-50 px-4 py-3 rounded-xl border border-blue-100">
          <span className="text-sm text-blue-600">
            {filteredCandidates.length === 0
              ? "No applications found"
              : `Showing ${filteredCandidates.length} of ${candidates.length} applications`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Applications;
