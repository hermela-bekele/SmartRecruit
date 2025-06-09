import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../sidebar";
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
import { 
  fetchApplications, 
  updateApplicationStatus,
  deleteApplication,
} from "../../../api/applications";
import EmailModal from "./EmailModal";
import CandidateDetailsModal from "./CandidateDetailsModal";

function Applications() {
  const [candidatesData, setCandidatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedStatusType, setSelectedStatusType] = useState("");
  const [emailTemplates, setEmailTemplates] = useState({
    Received: "",
    Interview: "",
    Reject: "",
    Hired: "",
    UnderReview: "",
    Shortlisted: "",
    Assessment: "",
    Offer: ""
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(5);

  // Load templates from localStorage
  useEffect(() => {
    const savedTemplates = JSON.parse(localStorage.getItem('emailTemplates')) || {
      Received: `Dear ((candidate_name)),\n\nThank you for applying for the ((position)) role at ((company_name)). We have received your application and will review it shortly.\n\nBest regards,\n((company_name)) Recruitment Team`,
      Interview: `Dear ((candidate_name)),\n\nWe would like to invite you for an interview for the ((position)) role. Please let us know your availability for the coming week.\n\nBest regards,\n((company_name)) Recruitment Team`,
      Reject: `Dear ((candidate_name)),\n\nThank you for your interest in the ((position)) role at ((company_name)). After careful consideration, we have decided to move forward with other candidates whose qualifications better match our current needs.\n\nBest regards,\n((company_name)) Recruitment Team`,
       UnderReview: `Dear ((candidate_name)),\n\nWe wanted to inform you that your application for the ((position)) role at ((company_name)) is currently under review by our hiring team. We will contact you soon with an update on your application status.\n\nBest regards,\n((company_name)) Recruitment Team`,
    Shortlisted: `Dear ((candidate_name)),\n\nWe are pleased to inform you that you have been shortlisted for the ((position)) role at ((company_name)). We will be in touch shortly to discuss the next steps in the hiring process.\n\nBest regards,\n((company_name)) Recruitment Team`,
    Assessment: `Dear ((candidate_name)),\n\nAs part of the selection process for the ((position)) role, we would like to invite you to complete an assessment. We will send you the details and instructions for the assessment shortly.\n\nBest regards,\n((company_name)) Recruitment Team`,                                                                                          
     Hired: `Dear ((candidate_name)),\n\nWelcome to ((company_name))! We are excited to have you join us as ((position)). We will be in touch with details about your onboarding process.\n\nBest regards,\n((company_name)) Recruitment Team`,
      Offer: `Dear ((candidate_name)),\n\nWe are pleased to offer you the position of ((position)) at ((company_name)). Please find attached the formal offer letter with all the details.\n\nBest regards,\n((company_name)) Recruitment Team`
    };
    setEmailTemplates(savedTemplates);
  }, []);

  // Load applications from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchApplications();
        setCandidatesData(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedPosition]);

  // Get unique statuses and positions for filter options
  const statusOptions = [...new Set(candidatesData.map((c) => c.status))];
  const positionOptions = [...new Set(candidatesData.map((c) => c.position))];

  // Filter candidates based on search and filters
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

  // Calculate pagination indexes
  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = filteredCandidates.slice(
    indexOfFirstCandidate,
    indexOfLastCandidate
  );
  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

  const openModal = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    console.log('handleStatusChange called with:', { candidateId, newStatus });
    
    try {
      const candidate = candidatesData.find(c => c.id === candidateId);
      console.log('Found candidate:', candidate);
      
      if (!candidate) {
        console.error('Candidate not found');
        return;
      }

      // Show email modal first
      console.log('Setting up email modal with:', {
        candidate,
        newStatus,
        template: emailTemplates[newStatus]
      });
      
      setSelectedCandidate(candidate);
      setSelectedStatusType(newStatus);
      setSelectedTemplate(emailTemplates[newStatus]);
      setShowEmailModal(true);
      
      console.log('Email modal should be visible now');
    } catch (error) {
      console.error('Error in handleStatusChange:', error);
      alert('Failed to prepare email. Please try again.');
    }
  };

  const sendEmail = async (content, subject) => {
    console.log('sendEmail called with:', { content, subject });
    
    try {
      // First update the status
      console.log('Attempting to update status via API...');
      const updatedApplication = await updateApplicationStatus(
        selectedCandidate.id,
        selectedStatusType,
        content,
        subject
      );
      console.log('Status updated successfully:', updatedApplication);
      
      // Update local state
      setCandidatesData(prev => {
        const updated = prev.map(c => 
          c.id === selectedCandidate.id 
            ? { ...c, status: selectedStatusType }
            : c
        );
        console.log('Updated candidates data:', updated);
        return updated;
      });
      
      setShowEmailModal(false);
    } catch (error) {
      console.error('Error updating status or sending email:', error.response?.data || error.message);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleDelete = async (candidateId) => {
    try {
      await deleteApplication(candidateId);
      setCandidatesData(prev => 
        prev.filter(candidate => candidate.id !== candidateId)
      );
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const handleExportCSV = () => {
    // Define the headers for the CSV
    const headers = [
      'Name',
      'Email',
      'Position',
      'Company',
      'Status',
      'Phone',
      'Skills',
      'Application Date'
    ];

    // Transform the data into CSV format
    const csvData = filteredCandidates.map(candidate => {
      return [
        candidate.name,
        candidate.email,
        candidate.position,
        candidate.company,
        candidate.status,
        candidate.phone || '',
        (candidate.skills || []).join(', '),
        candidate.timeline?.[0]?.date || ''
      ];
    });

    // Add headers to the beginning of the data
    csvData.unshift(headers);

    // Convert to CSV string
    const csvString = csvData
      .map(row => 
        row.map(cell => {
          // Handle cells that contain commas, quotes, or newlines
          if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        }).join(',')
      )
      .join('\n');

    // Create a Blob and download link
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Set up download link
    link.setAttribute('href', url);
    link.setAttribute('download', `candidates_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    // Add to document, click and cleanup
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

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
                  {candidatesData.length} total applications
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <DownloadCloud size={18} />
            Export CSV
          </button>
        </div>

        {/* Filters Section */}
        <div className="mb-8 flex gap-4 items-center flex-wrap">
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
              {currentCandidates.map((candidate) => (
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
                  <td className="px-6 py-4 relative dropdown-container">
                    <button
                      data-id={candidate.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        const button = e.currentTarget;
                        const tableBottom = document.querySelector('table').getBoundingClientRect().bottom;
                        const buttonBottom = button.getBoundingClientRect().bottom;
                        const spaceBelow = tableBottom - buttonBottom;
                        
                        // Store whether to show dropdown above or below
                        button.dataset.position = spaceBelow < 200 ? 'above' : 'below';
                        
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
                      <div 
                        className={`
                          absolute right-0 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50
                          ${document.querySelector(`[data-id="${candidate.id}"]`)?.dataset.position === 'above' 
                            ? 'bottom-full mb-2' 
                            : 'top-full mt-2'}
                        `}
                      >
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
                              handleStatusChange(candidate.id, "UnderReview")
                            }
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-md"
                          >
                            Under Review
                          </button>
                                                    <button
                            onClick={() =>
                              handleStatusChange(candidate.id, "Shortlisted")
                            }
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-md"
                          >
                            Shortlisted
                          </button>
                                                    <button
                            onClick={() =>
                              handleStatusChange(candidate.id, "Assessment")
                            }
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-md"
                          >
                            Assessment
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
                              handleStatusChange(candidate.id, "Hired")
                            }
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-md"
                          >
                            Hired
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(candidate.id, "Reject")
                            }
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-md"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleDelete(candidate.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-md"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Email Modal */}
        <EmailModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          candidate={selectedCandidate}
          template={selectedTemplate}
          status={selectedStatusType}
          onSend={sendEmail}
        />

        {/* Candidate Details Modal */}
        <CandidateDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          candidate={selectedCandidate}
        />

        {/* Pagination Footer */}
        <div className="mt-6 bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">
              {filteredCandidates.length === 0
                ? "No applications found"
                : `Showing ${indexOfFirstCandidate + 1} to ${Math.min(
                    indexOfLastCandidate,
                    filteredCandidates.length
                  )} of ${filteredCandidates.length} candidates`}
            </span>
            
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${
                  currentPage === 1
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Previous
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`p-2 w-10 h-10 flex items-center justify-center rounded-lg ${
                    currentPage === page
                      ? "bg-purple-100 text-purple-600"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Applications;