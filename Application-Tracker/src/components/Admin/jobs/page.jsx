import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../../sidebar";
import { X, Search, Plus, Briefcase, MapPin, Clock, FileText, Users, Calendar } from "lucide-react";

function Jobs() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [jobs, setJobs] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    location: '',
    postedWithin: ''
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/data/postedJobs.json");
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching job data:", error);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest('.dropdown-container')) {
      setOpenDropdownId(null);
    }
  };

  document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
}, []);

// Add action handlers
const handleEditJob = (jobId) => {
  const job = jobs.find(j => j.id === jobId);
  setFormData({
    title: job.title,
    department: job.department,
    location: job.location,
    employmentType: job.employmentType,
    description: job.description,
    postingDate: job.postingDate,
    expirationDate: job.expirationDate
  });
  setShowModal(true);
  setOpenDropdownId(null);
};

const handleDeleteJob = (jobId) => {
  setJobs(prev => prev.filter(job => job.id !== jobId));
  setOpenDropdownId(null);
};

const handleClosePosition = (jobId) => {
  setJobs(prev => 
    prev.map(job => 
      job.id === jobId ? { ...job, status: "Closed" } : job
    )
  );
  setOpenDropdownId(null);
};

  // Get unique filter values
  const departments = [...new Set(jobs.map(job => job.department))];
  const statuses = [...new Set(jobs.map(job => job.status))];
  const locations = [...new Set(jobs.map(job => job.location))];
  const postedWithinOptions = [
    { label: 'Last 7 days', value: 7 },
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 90 days', value: 90 }
  ];

  const isWithinDateRange = (postingDate, days) => {
    const jobDate = new Date(postingDate);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return jobDate >= cutoffDate;
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = (
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesFilters = (
      (!filters.department || job.department === filters.department) &&
      (!filters.status || job.status === filters.status) &&
      (!filters.location || job.location === filters.location) &&
      (!filters.postedWithin || isWithinDateRange(job.postingDate, filters.postedWithin))
    );

    return matchesSearch && matchesFilters;
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({
      department: '',
      status: '',
      location: '',
      postedWithin: ''
    });
  };

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    employmentType: "",
    description: "",
    postingDate: "",
    expirationDate: ""
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.employmentType.trim()) newErrors.employmentType = "Employment type is required";
    if (!formData.postingDate) newErrors.postingDate = "Posting date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newJob = {
      id: jobs.length + 1,
      title: formData.title,
      department: formData.department,
      location: formData.location,
      posted: new Date(formData.postingDate).toLocaleDateString("en-US"),
      applications: 0,
      status: "Active",
      employmentType: formData.employmentType,
      description: formData.description,
      expirationDate: formData.expirationDate
    };

    setJobs(prev => [newJob, ...prev]);
    setShowModal(false);
    setFormData({
      title: "",
      department: "",
      location: "",
      employmentType: "",
      description: "",
      postingDate: "",
      expirationDate: ""
    });
  };

  return (
    <div className="min-h-screen flex bg-slate-50/5">
      <Sidebar />

      <div className="ml-42 flex-1 min-h-screen p-8">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Job Postings</h1>
            <div className="flex items-center gap-3">
              <span className="text-slate-600 flex items-center gap-1">
                <Clock size={16} /> Last updated: Today
              </span>
              <div className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-purple-700 text-sm">{jobs.length} active postings</span>
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
          <Search size={18} className="absolute left-3 top-3.5 text-slate-400" />
        </div>

        {/* Filters Section */}
        <div className="mb-8 flex flex-wrap gap-4 items-center">
          <select 
            className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700"
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select 
            className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select 
            className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          <select 
            className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700"
            value={filters.postedWithin}
            onChange={(e) => handleFilterChange('postedWithin', e.target.value)}
          >
            <option value="">Posted Anytime</option>
            {postedWithinOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
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
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {["Job Title", "Department", "Location", "Posted", "Applications", "Status", "Actions"].map((header) => (
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
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Briefcase size={18} className="text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{job.title}</div>
                        <div className="text-sm text-slate-500">JOB-{job.id.toString().padStart(3, '0')}</div>
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
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {job.posted}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{job.applications}</span>
                      <span className="text-slate-500 text-sm">applicants</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      job.status === "Active" ? "bg-green-100 text-green-800" :
                      job.status === "Closing Soon" ? "bg-amber-100 text-amber-800" :
                      "bg-slate-100 text-slate-800"
                    }`}>
                      {job.status}
                    </span>
                  </td>
<td className="px-6 py-4 relative">
  <button 
    onClick={(e) => {
      e.stopPropagation();
      setOpenDropdownId(openDropdownId === job.id ? null : job.id);
    }}
    className="text-purple-600 hover:text-purple-800 p-2 rounded-lg hover:bg-slate-100"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  </button>

  {openDropdownId === job.id && (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-10 dropdown-container">
      <div className="p-2 space-y-1">
        <button
          onClick={() => handleEditJob(job.id)}
          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-md"
        >
          Edit Position
        </button>
        <button
          onClick={() => console.log(`Navigate to applicants for ${job.id}`)}
          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-md"
        >
          View Applicants
        </button>
        {job.status !== "Closed" && (
          <button
            onClick={() => handleClosePosition(job.id)}
            className="w-full px-4 py-2 text-left text-sm text-amber-600 hover:bg-amber-50 rounded-md"
          >
            Close Position
          </button>
        )}
        <button
          onClick={() => handleDeleteJob(job.id)}
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

        {/* Create Job Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl">
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-2xl font-bold text-slate-900">Create New Position</h3>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleCreateJob} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
                          Job Title *
                        </label>
                        <input
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
                          Department *
                        </label>
                        <input
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        {errors.department && <p className="text-red-500 text-sm mt-2">{errors.department}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
                          Location *
                        </label>
                        <input
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        {errors.location && <p className="text-red-500 text-sm mt-2">{errors.location}</p>}
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
                          Employment Type *
                        </label>
                        <select
                          name="employmentType"
                          value={formData.employmentType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="">Select type</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Freelance">Freelance</option>
                        </select>
                        {errors.employmentType && <p className="text-red-500 text-sm mt-2">{errors.employmentType}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
                          Posting Date *
                        </label>
                        <input
                          type="date"
                          name="postingDate"
                          value={formData.postingDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        {errors.postingDate && <p className="text-red-500 text-sm mt-2">{errors.postingDate}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
                          Expiration Date
                        </label>
                        <input
                          type="date"
                          name="expirationDate"
                          value={formData.expirationDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
                      Job Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Create Position
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Table pagination */}
        <div className="mt-6 bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">
              {filteredJobs.length === 0
                ? "No job postings found"
                : `Showing 1-${filteredJobs.length} of ${jobs.length} positions`}
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

export default Jobs;