import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../../sidebar";
import { X } from "lucide-react";

function Jobs() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [jobs, setJobs] = useState([]);

    useEffect(() => {
      const fetchJobs = async () => {
        try {
          const response = await fetch("src/data/postedJobs.json");
          const data = await response.json();
          setJobs(data);
        } catch (error) {
          console.error("Error fetching job data:", error);
        }
      };
  
      fetchJobs();
    }, []);

  const filteredJobs = jobs.filter(job => {
    const query = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.department.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      job.status.toLowerCase().includes(query)
    );
  });

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
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
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="ml-64 flex-1 min-h-screen w-[calc(100%-16rem)] bg-gradient from-blue-50 to-blue-100 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Job Postings</h1>
          <p className="text-blue-600">Manage your open positions</p>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1">
          <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery} // Added search binding
              onChange={(e) => setSearchQuery(e.target.value)} // Added search handler
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
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
          >
            Create New Job
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-blue-900">Create New Job Posting</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-blue-400 hover:text-blue-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateJob} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Job Title *
                    </label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Frontend Developer"
                      className="w-full p-3 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Department *
                    </label>
                    <input
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="e.g. Engineering"
                      className="w-full p-3 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Location *
                    </label>
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g. Remote, New York, NY"
                      className="w-full p-3 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Employment Type *
                    </label>
                    <select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                    {errors.employmentType && <p className="text-red-500 text-sm mt-1">{errors.employmentType}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Job Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe the job role, responsibilities, and requirements..."
                    className="w-full p-3 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Posting Date *
                    </label>
                    <input
                      type="date"
                      name="postingDate"
                      value={formData.postingDate}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.postingDate && <p className="text-red-500 text-sm mt-1">{errors.postingDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Expiration Date
                    </label>
                    <input
                      type="date"
                      name="expirationDate"
                      value={formData.expirationDate}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                {["Job Title", "Department", "Location", "Posted", "Applications", "Status", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-sm font-semibold text-blue-900 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-100">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-blue-900">
                        {job.title}
                      </span>
                      <span className="text-sm text-blue-500">
                        JOB-{job.id.toString().padStart(3, '0')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-blue-900">{job.department}</td>
                  <td className="px-6 py-4 text-blue-900">{job.location}</td>
                  <td className="px-6 py-4 text-blue-900">{job.posted}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-green-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-blue-900">{job.applications}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        job.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : job.status === "Closing Soon"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-100">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-blue-50 px-4 py-3 rounded-xl border border-blue-100">
        <span className="text-sm text-blue-600">
            {filteredJobs.length === 0 // Updated showing text
              ? 'No job postings found'
              : `Showing 1-${filteredJobs.length} of ${filteredJobs.length} job postings`
            }
          </span>
        </div>
      </div>
    </div>
  );
}

export default Jobs;