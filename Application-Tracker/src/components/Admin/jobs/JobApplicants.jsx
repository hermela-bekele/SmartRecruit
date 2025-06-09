import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Sidebar from "../../sidebar";
import {
  Search,
  ArrowLeft,
  Download,
  Mail,
  Phone,
  Calendar,
  Clock,
  FileText,
  User,
} from "lucide-react";
import JobsService from "../../../services/jobs.service";
import CandidateDetailsModal from "../applications/CandidateDetailsModal";

export default function JobApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobile(isMobile);
      if (isMobile) setIsCollapsed(true);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchJobAndApplicants = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch job details
        const jobData = await JobsService.getJob(jobId);
        setJob(jobData);

        // Fetch applicants
        const applicantsData = await JobsService.getJobApplicants(jobId);
        console.log("Received applicants data:", applicantsData);
        setApplicants(applicantsData);
      } catch (error) {
        console.error("Error fetching job and applicants:", error);
        setError(error.message || "Failed to load job and applicants");
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndApplicants();
  }, [jobId]);

  const filteredApplicants = applicants.filter(
    (applicant) =>
      applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => navigate("/jobs")}
          className="text-purple-600 hover:text-purple-700"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50/5">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`flex-1 min-h-screen p-4 md:p-6 lg:p-10 transition-all duration-300 ${
          !isMobile ? (isCollapsed ? "md:ml-20" : "md:ml-72") : ""
        }`}
      >
        {/* Header Section */}
        <div className="mb-8">
          <Link
            to="/jobs"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Link>

          {job && (
            <>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {job.title} - Applicants
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-slate-600 flex items-center gap-1">
                  <Clock size={16} /> Last updated: Today
                </span>
                <div className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-purple-700 text-sm">
                    {applicants.length} applicants
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Search Section */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search applicants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-900"
          />
          <Search
            size={18}
            className="absolute left-3 top-3.5 text-slate-400"
          />
        </div>

        {/* Applicants List */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Applicant
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Applied Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplicants.length > 0 ? (
                  filteredApplicants.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">
                              {applicant.name}
                            </div>
                            <div className="text-sm text-slate-500">
                              Applied for {job?.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail className="w-4 h-4" />
                            {applicant.email}
                          </div>
                          {applicant.phone && (
                            <div className="flex items-center gap-2 text-slate-600">
                              <Phone className="w-4 h-4" />
                              {applicant.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(applicant.appliedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            applicant.status === "Hired"
                              ? "bg-green-100 text-green-800"
                              : applicant.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {applicant.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openModal(applicant)}
                            className="text-purple-600 hover:text-purple-800 px-4 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 transition-colors flex items-center gap-2"
                          >
                            <FileText className="w-4 h-4" /> Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <User className="w-12 h-12 text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-1">
                          No applicants found
                        </h3>
                        <p className="text-slate-500">
                          {searchQuery
                            ? "Try adjusting your search"
                            : "This job has no applicants yet"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Candidate Details Modal */}
        <CandidateDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          candidate={selectedCandidate}
        />
      </div>
    </div>
  );
}
