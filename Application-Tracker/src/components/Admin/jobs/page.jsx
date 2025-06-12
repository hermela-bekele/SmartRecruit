import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../../sidebar";
import {
  X,
  Search,
  Plus,
  Briefcase,
  MapPin,
  Clock,
  FileText,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import JobsService from "../../../services/jobs.service";
import CreateJobModal from "./CreateJobModal";
import EditJobModal from "./EditJobModal";

function Jobs() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [filters, setFilters] = useState({
    department: "",
    status: "",
    location: "",
    company: "",
    postedWithin: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const [errors, setErrors] = useState({});

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

  /* load jobs on component mount */
  useEffect(() => {
    fetchJobs();
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const fetchJobs = async () => {
    try {
      console.log("Fetching jobs...");
      const data = await JobsService.getAllJobs();
      console.log("Jobs fetched successfully:", data);
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-container")) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Add action handlers
  const handleEditJob = (id) => {
    const job = jobs.find((j) => j.id === id);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      company: job.company,
      employmentType: job.employmentType,
      description: job.description,
      postingDate: new Date(job.postingDate).toISOString().split("T")[0],
      expirationDate: job.expirationDate
        ? new Date(job.expirationDate).toISOString().split("T")[0]
        : "",
    });
    setEditingJob(job);
    setOpenDropdownId(null);
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await JobsService.updateJob(editingJob.id, {
        ...formData,
        expirationDate: formData.expirationDate || null,
        postingDate: new Date(formData.postingDate).toISOString(),
      });

      await fetchJobs();
      setEditingJob(null);
      setErrors({});
    } catch (error) {
      console.error("Error updating job:", error);
      setErrors({ submit: error.message });
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await JobsService.deleteJob(id);
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job. Please try again.");
    }
  };

const handleClosePosition = async (id) => {
  try {
    console.log('Attempting to close position with ID:', id);
    
    // Get the current job to verify we have the correct ID
    const currentJob = jobs.find(j => j.id === id);
    if (!currentJob) {
      throw new Error(`Could not find job with ID ${id}`);
    }
    console.log('Found job to close:', currentJob);

    try {
      // First try the dedicated endpoint
      const result = await JobsService.closePosition(id);
      console.log('Position closed successfully using closePosition endpoint:', result);
    } catch (closeError) {
      console.error('Error using closePosition endpoint:', closeError);
      console.log('Attempting fallback to updateJob...');
      
      // Fallback to updateJob if closePosition fails
      const result = await JobsService.updateJob(id, {
        status: "Closed",
        // Include other required fields to ensure validation passes
        title: currentJob.title,
        department: currentJob.department,
        location: currentJob.location,
        company: currentJob.company,
        employmentType: currentJob.employmentType,
        description: currentJob.description,
        postingDate: currentJob.postingDate
      });
      console.log('Position closed successfully using updateJob fallback:', result);
    }
    
    await fetchJobs(); // Refresh the jobs list
  } catch (error) {
    console.error("Error closing position:", error);
    // More detailed error message
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
    alert(`Failed to close position: ${errorMessage}. Please check console for details.`);
  }
};

const handleReopenPosition = async (id) => {
  try {
    console.log('Attempting to reopen position with ID:', id);
    
    // Get the current job to verify we have the correct ID
    const currentJob = jobs.find(j => j.id === id);
    if (!currentJob) {
      throw new Error(`Could not find job with ID ${id}`);
    }
    console.log('Found job to reopen:', currentJob);
    
    const result = await JobsService.updateJob(id, {
      status: "Active",
      // Include other required fields to ensure validation passes
      title: currentJob.title,
      department: currentJob.department,
      location: currentJob.location,
      company: currentJob.company,
      employmentType: currentJob.employmentType,
      description: currentJob.description,
      postingDate: currentJob.postingDate
    });
    
    console.log('Position reopened successfully:', result);
    await fetchJobs();
  } catch (error) {
    console.error("Error reopening position:", error);
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
    alert(`Failed to reopen position: ${errorMessage}. Please check console for details.`);
  }
};

  // Get unique filter values
  const departments = [...new Set(jobs.map((job) => job.department))];
  const statuses = [...new Set(jobs.map((job) => job.status))];
  const locations = [...new Set(jobs.map((job) => job.location))];
  const companies = [...new Set(jobs.map((job) => job.company))];
  const postedWithinOptions = [
    { label: "Last 7 days", value: 7 },
    { label: "Last 30 days", value: 30 },
    { label: "Last 90 days", value: 90 },
  ];

  const isWithinDateRange = (postingDate, days) => {
    const jobDate = new Date(postingDate);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return jobDate >= cutoffDate;
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.status.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters =
      (!filters.department || job.department === filters.department) &&
      (!filters.status || job.status === filters.status) &&
      (!filters.location || job.location === filters.location) &&
      (!filters.company || job.company === filters.company) &&
      (!filters.postedWithin ||
        isWithinDateRange(job.postingDate, filters.postedWithin));

    return matchesSearch && matchesFilters;
  });

  // Pagination calculations
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({
      department: "",
      status: "",
      location: "",
      company: "",
      postedWithin: "",
    });
  };

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    company: "",
    employmentType: "",
    description: "",
    postingDate: "",
    expirationDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.department.trim())
      newErrors.department = "Department is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.company.trim()) newErrors.company = "Company is required";
    if (!formData.employmentType.trim())
      newErrors.employmentType = "Employment type is required";
    if (!formData.postingDate)
      newErrors.postingDate = "Posting date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await JobsService.createJob({
        ...formData,
        expirationDate: formData.expirationDate || null,
        postingDate: new Date(formData.postingDate).toISOString(),
      });

      // Reset form and close modal
      setFormData({
        title: "",
        department: "",
        location: "",
        company: "",
        employmentType: "",
        description: "",
        postingDate: "",
        expirationDate: "",
      });
      setShowModal(false);
      setErrors({});
      
      // Refresh jobs list
      await fetchJobs();
    } catch (error) {
      console.error("Error creating job:", error);
      setErrors({ submit: error.message });
    }
  };

  // Update the View Applicants button click handler
  const handleViewApplicants = (jobId) => {
    navigate(`/jobs/${jobId}/applicants`);
    setOpenDropdownId(null);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50/5">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`flex-1 min-h-screen p-4 md:p-6 lg:p-10 transition-all duration-300 ${
          !isMobile ? (isCollapsed ? "md:ml-20" : "md:ml-72") : ""
        }`}
      >
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Job Postings
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-slate-600 flex items-center gap-1">
                <Clock size={16} /> Last updated: Today
              </span>
              <div className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-purple-700 text-sm">
                  {jobs.length} active postings
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={18} />
            Create New Job
          </button>
        </div>

        {/* Search Section */}
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-900"
          />
          <Search
            size={18}
            className="absolute left-3 top-3.5 text-slate-400"
          />
        </div>

        {/* Filters Section */}
        <div className="mb-8 flex flex-wrap gap-4 items-center">
          <select
            className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700"
            value={filters.department}
            onChange={(e) => handleFilterChange("department", e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700"
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700"
            value={filters.company}
            onChange={(e) => handleFilterChange("company", e.target.value)}
          >
            <option value="">All Companies</option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700"
            value={filters.postedWithin}
            onChange={(e) => handleFilterChange("postedWithin", e.target.value)}
          >
            <option value="">Posted Anytime</option>
            {postedWithinOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            onClick={clearFilters}
            className="px-4 py-2 text-slate-600 hover:text-purple-600 transition-colors flex items-center gap-2"
          >
            <X size={16} />
            Clear All
          </button>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 relative">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Job Title",
                  "Department",
                  "Location",
                  "company",
                  "Posted",
                  "Applications",
                  "Status",
                  "Actions",
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
              {currentJobs.length > 0 ? (
                currentJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Briefcase size={18} className="text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">
                            {job.title}
                          </div>
                          <div className="text-sm text-slate-500">
                            JOB-{job.id.toString().padStart(3, "0")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Users size={16} />
                        {job.department}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin size={16} />
                        {job.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        {job.company}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {job.postingDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">
                          {job.applicationCount || 0}
                        </span>
                        <span className="text-slate-500 text-sm">
                          applicants
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          job.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : job.status === "Closing Soon"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(
                            openDropdownId === job.id ? null : job.id
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

                      {openDropdownId === job.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-10 dropdown-container">
                          <div className="p-2 space-y-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditJob(job.id);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-md"
                            >
                              Edit Position
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewApplicants(job.id);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-md"
                            >
                              View Applicants
                            </button>
                            {job.status === "Closed" ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReopenPosition(job.id);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 rounded-md"
                              >
                                Reopen Position
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClosePosition(job.id);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-amber-600 hover:bg-amber-50 rounded-md"
                              >
                                Close Position
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteJob(job.id);
                                setOpenDropdownId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-md"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Briefcase className="h-12 w-12 text-slate-300 mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-1">
                        No jobs found
                      </h3>
                      <p className="text-slate-500">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredJobs.length > jobsPerPage && (
          <div className="mt-6 bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-medium">
                {indexOfFirstJob + 1} -{" "}
                {Math.min(indexOfLastJob, filteredJobs.length)}
              </span>{" "}
              of <span className="font-medium">{filteredJobs.length}</span> jobs
            </div>

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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
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
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
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
        )}

        {/* Create Job Modal */}
        <CreateJobModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateJob}
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
        />

        {/* Edit Job Modal */}
        <EditJobModal
          isOpen={!!editingJob}
          onClose={() => setEditingJob(null)}
          onSubmit={handleUpdateJob}
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
        />
      </div>
    </div>
  );
}

export default Jobs;
