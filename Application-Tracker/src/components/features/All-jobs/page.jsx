"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, Calendar, MapPin } from "lucide-react";
import JobCard from "../JobCard";
import JobDetailsModal from "../jobDetailsModal";
import Footer from "../footer";

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:3000/jobs");
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();
        setJobs(data);

        // Extract unique locations
        const uniqueLocations = [...new Set(data.map((job) => job.location))];
        setLocations(uniqueLocations);

        // Extract unique categories (departments)
        const uniqueCategories = [
          ...new Set(data.map((job) => job.department)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching job data:", error);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();

    const filtered = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(lowerQuery) ||
        job.company.toLowerCase().includes(lowerQuery) ||
        job.description.toLowerCase().includes(lowerQuery);
      const matchesLocation = selectedLocation
        ? job.location.toLowerCase() === selectedLocation.toLowerCase()
        : true;
      const matchesCategory = selectedCategory
        ? job.department.toLowerCase() === selectedCategory.toLowerCase()
        : true;

      return matchesSearch && matchesLocation && matchesCategory;
    });

    setFilteredJobs(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [jobs, searchQuery, selectedLocation, selectedCategory]);

  // Pagination calculations
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-blue-50 via-blue-50 to-white">
      {/* Header */}
      <header className="w-full bg-gray-900 text-gray-300 backdrop-blur-sm border-b border-blue-100 py-4 px-4 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <div className="bg-blue-600 text-white font-bold rounded-lg p-2 mr-2">
              SM
            </div>
            <span className="text-xl font-bold text-blue-800">
              Smart Recruit
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Home
            </a>
            <a
              href="/all-jobs"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Jobs
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-blue-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 px-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <a
                href="/"
                className="text-blue-600 hover:text-blue-800 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="/all-jobs"
                className="text-blue-600 hover:text-blue-800 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Jobs
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <section className="w-full py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white backdrop-blur-lg border border-blue-200 rounded-xl p-6 shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search and Filter Inputs */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  className="w-full px-10 py-2 bg-white border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-blue-400" />
              </div>

              {/* location filter */}
              <div className="relative">
                <select
                  className="w-full px-3 py-2 text-blue-900 border border-blue-200 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="" className="text-blue-400">
                    All Locations
                  </option>
                  {locations.map((location) => (
                    <option
                      key={location}
                      value={location}
                      className="text-blue-900"
                    >
                      {location}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* category filter */}
              <div className="relative">
                <select
                  className="w-full px-3 py-2 text-blue-900 border border-blue-200 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="" className="text-blue-400">
                    All Categories
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="text-blue-900"
                    >
                      {category}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={() => {
                    setSelectedJob(job);
                    setShowApplicationForm(false);
                  }}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-blue-600 text-xl">
                  No jobs found matching your criteria
                </p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredJobs.length > jobsPerPage && (
            <div className="flex justify-center items-center mt-12 gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Previous
              </button>

              <span className="text-blue-600 font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          showApplicationForm={showApplicationForm}
          setShowApplicationForm={setShowApplicationForm}
        />
      )}
    </div>
  );
}

export default JobsPage;
