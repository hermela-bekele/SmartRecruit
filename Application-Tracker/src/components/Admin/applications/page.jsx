import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../../sidebar";
import candidates from "../../../../src/data/candidates.json";
import {
  Search,
  X,
  DownloadCloud,
  ChevronDown,
  Clock,
  MapPin,
  Briefcase,
  FileText,
} from "react-feather";

function Applications() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
const [candidatesData, setCandidatesData] = useState(() =>
  candidates.map((c, index) => ({ 
    ...c, 
    id: index + 1,
    company: c.company 
  }))
);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedStatusType, setSelectedStatusType] = useState("");
  const [emailTemplates, setEmailTemplates] = useState({
    Received: "",
    Interview: "",
    Reject: "",
    Offer: ""
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

    // Load templates from localStorage
  useEffect(() => {
    const savedTemplates = JSON.parse(localStorage.getItem('emailTemplates')) || {
      Received: `Dear ((candidate_name)),\n\nThank you for applying for the ((position)) role at ((company_name)). We have received your application and will review it shortly.\n\nBest regards,\n((company_name)) Recruitment Team`,
      Interview: `Dear ((candidate_name)),\n\nWe would like to invite you for an interview for the ((position)) role. Please let us know your availability for the coming week.\n\nBest regards,\n((company_name)) Recruitment Team`,
      Reject: `Dear ((candidate_name)),\n\nThank you for your interest in the ((position)) role at ((company_name)). After careful consideration, we have decided to move forward with other candidates whose qualifications better match our current needs.\n\nBest regards,\n((company_name)) Recruitment Team`,
      Offer: `Dear ((candidate_name)),\n\nWe are pleased to offer you the position of ((position)) at ((company_name)). Please find attached the formal offer letter with all the details.\n\nBest regards,\n((company_name)) Recruitment Team`
    };
    setEmailTemplates(savedTemplates);
  }, []);

  // Get unique statuses and positions for filter options
  const statusOptions = [...new Set(candidatesData.map((c) => c.status))];
  const positionOptions = [...new Set(candidatesData.map((c) => c.position))];

  const filteredCandidates = candidatesData.filter((candidate) => {
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

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest('.dropdown-container')) {
      setOpenDropdownId(null);
    }
  };

  document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
}, []);

  const openModal = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  /* add status update action  */

  const handleStatusChange = (candidateId, newStatus) => {
    const candidate = candidatesData.find(c => c.id === candidateId);
    setSelectedCandidate(candidate);
    setSelectedStatusType(newStatus);
    setSelectedTemplate(emailTemplates[newStatus]);
    setShowEmailModal(true);
  };

    const sendEmail = (content, subject) => {
    console.log('Email sent:', {
      to: selectedCandidate.email,
      subject,
      content
    });
    // Update candidate status after sending email
    setCandidatesData(prev => 
      prev.map(candidate => 
        candidate.id === selectedCandidate.id
          ? { ...candidate, status: selectedStatusType }
          : candidate
      )
    );
  };

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobile(isMobile);
      if (isMobile) setIsCollapsed(true);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50/5">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div 
        className={`flex-1 min-h-screen p-4 md:p-6 lg:p-10 transition-all duration-300 ${
          !isMobile ? (isCollapsed ? 'md:ml-20' : 'md:ml-72') : ''
        }`}
      >
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Candidate Applications
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-slate-600 flex items-center gap-1">
                <Clock size={16} /> Last updated: Today
              </span>
              <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 text-sm">
                  25 total applications
                </span>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 transition-colors">
            <DownloadCloud size={18} />
            Export CSV
          </button>
        </div>

        {/* Filters Section */}
        <div className="mb-8 flex gap-4 items-center">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl">
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-900"
            />
            <Search
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-48 pl-3 pr-8 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-900 appearance-none"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-3.5 text-slate-400 pointer-events-none"
            />
          </div>

          {/* Position Filter */}
          <div className="relative">
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-48 pl-3 pr-8 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-900 appearance-none"
            >
              <option value="">All Positions</option>
              {positionOptions.map((position, index) => (
                <option key={index} value={position}>
                  {position}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-3.5 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Candidate",
                  "Position",
                  "Company",
                  "Status",
                  "Details",
                  "Action",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 font-medium">
                          {candidate.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {candidate.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {candidate.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} className="text-slate-400" />
                      <span className="text-slate-900">
                        {candidate.position}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-slate-400" />
                      <span className="text-slate-600">
                        {candidate.company}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        candidate.status === "Hired"
                          ? "bg-green-100 text-green-800"
                          : candidate.status === "Rejected"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openModal(candidate)}
                      className="text-purple-600 hover:text-purple-800 px-4 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 transition-colors flex items-center gap-2"
                    >
                      <FileText size={16} /> View
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <td className="px-6 py-4 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(
                            openDropdownId === candidate.id
                              ? null
                              : candidate.id
                          );
                        }}
          className="text-purple-600 hover:text-purple-800 p-2 rounded-lg hover:bg-slate-100"
        >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                          />
                        </svg>
                      </button>

                      {openDropdownId === candidate.id && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-10">
                          <div className="p-2 space-y-1">
                            <button
                              onClick={() =>
                                handleStatusChange(candidate.id, "Received")
                              }
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-md"
                            >
                              Received
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(candidate.id, "Interview")
                              }
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-md"
                            >
                              Interview
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(candidate.id, "Offer")
                              }
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-md"
                            >
                              Offer
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(candidate.id, "Reject")
                              }
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-md"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <EmailModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          candidate={selectedCandidate}
          template={selectedTemplate}
          status={selectedStatusType}
          onSend={sendEmail}
        />

        {/* Candidate Details Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {selectedCandidate?.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 flex items-center gap-1">
                        <Briefcase size={16} /> {selectedCandidate?.position}
                      </span>
                      <span className="text-slate-600 flex items-center gap-1">
                        <MapPin size={16} /> {selectedCandidate?.company}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4">
                        Contact Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-slate-500">Email</p>
                          <p className="text-slate-900">
                            {selectedCandidate?.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Phone</p>
                          <p className="text-slate-900">
                            {selectedCandidate?.phone || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4">
                        Skills & Experience
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate?.skills?.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4">
                        Application Timeline
                      </h4>
                      <div className="space-y-4">
                        {selectedCandidate?.timeline?.map((event, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                            <div>
                              <p className="text-sm text-slate-900">
                                {event.date}
                              </p>
                              <p className="text-sm text-slate-500">
                                {event.status}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4">
                        Documents
                      </h4>
                      <button className="text-purple-600 hover:text-purple-800 flex items-center gap-2">
                        <DownloadCloud size={18} />
                        {selectedCandidate?.resume}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="mt-6 bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">
              {filteredCandidates.length === 0
                ? "No applications found"
                : `Showing ${filteredCandidates.length} of ${candidates.length} candidates`}
            </span>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                Previous
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailModal({ isOpen, onClose, candidate, template, status, onSend }) {
  const [emailContent, setEmailContent] = useState("");
  const [subject, setSubject] = useState("");

  useEffect(() => {
    if (isOpen && template && candidate) {
      const populatedContent = template
      .replace(/\(\(candidate_name\)\)/g, candidate.name)
      .replace(/\(\(position\)\)/g, candidate.position)
      .replace(/\(\(company_name\)\)/g, candidate.company); 

      setEmailContent(populatedContent);
      
      const subjects = {
      Received: `Application Received Confirmation - ${candidate.company}`,
      Interview: `${candidate.company} Interview Invitation`,
      Reject: `Application Update from ${candidate.company}`,
      Offer: `${candidate.company} Job Offer`
      };
      setSubject(subjects[status] || "Important Update Regarding Your Application");
    }
  }, [isOpen, template, candidate, status]);

  return (
    <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-slate-900">
              Send {status} Email to {candidate?.name}
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Content</label>
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
              />
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <button onClick={onClose} className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                Cancel
              </button>
              <button 
                onClick={() => {
                  onSend(emailContent, subject);
                  onClose();
                }}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Applications;
