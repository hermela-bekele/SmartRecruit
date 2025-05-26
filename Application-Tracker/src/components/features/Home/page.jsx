"use client";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Search,
  Calendar,
  MapPin,
  Menu,
  X,
  ArrowLeft,
  Upload,
} from "lucide-react";
import LoginModal from "../../auth/Login/page";
import JobCard from "../JobCard";
import JobDetailsModal from "../jobDetailsModal";
import Footer from "../footer";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
      const response = await fetch("http://localhost:3000/jobs");
      if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching job data:", error);
      }
    };

    fetchJobs();
  }, []);
  /* search filter effect */
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();

    const filtered = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(lowerQuery) ||
        job.department.toLowerCase().includes(lowerQuery) ||
        job.description.toLowerCase().includes(lowerQuery);
      const matchesLocation = selectedLocation
        ? job.location.toLowerCase() === selectedLocation.toLowerCase()
        : true;
      const matchesCatagory = selectedCategory
        ? job.department.toLowerCase() === selectedCategory.toLowerCase()
        : true;

      return matchesSearch && matchesLocation && matchesCatagory;
    });

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, selectedLocation, selectedCategory]);

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
            <button
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 font-medium"
              onClick={() => setIsLoginModalOpen(true)}
            >
              Login
            </button>
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
              <button
                className="text-left px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 font-medium"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsLoginModalOpen(true);
                }}
              >
                Login
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="w-full py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-800">
              Find Your Next Opportunity
            </h1>
            <p className="text-xl text-blue-600 max-w-2xl mx-auto ">
              Discover thousands of job opportunities with top employers to find
              your perfect role.
            </p>
          </div>

          <div className="bg-white backdrop-blur-lg border border-blue-200 rounded-xl p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <option value="" selected className="text-blue-400">
                    All Location
                  </option>
                  <option value="remote" className="text-blue-900">
                    Remote
                  </option>
                  <option value="austin" className="text-blue-900">
                    Austin, TX
                  </option>
                  <option value="san francisco" className="text-blue-900">
                    San Francisco, CA
                  </option>
                  <option value="new york" className="text-blue-900">
                    New York, NY
                  </option>
                  <option value="seattle" className="text-blue-900">
                    Seattle, WA
                  </option>
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

              {/* catagory filter */}

              <div className="relative">
                <select
                  className="w-full px-3 py-2 text-blue-900 border border-blue-200 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="" selected className="text-blue-400">
                    All Category
                  </option>
                  <option value="engineering" className="text-blue-900">
                    Engineering
                  </option>
                  <option value="design" className="text-blue-900">
                    Design
                  </option>
                  <option value="marketing" className="text-blue-900">
                    Marketing
                  </option>
                  <option value="product" className="text-blue-900">
                    Product
                  </option>
                  <option value="sales" className="text-blue-900">
                    Sales
                  </option>
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

              {/*               <div className="md:col-span-3">
                <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-md hover:shadow-lg">
                  Search Jobs
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="w-full py-16 px-4 bg-blue-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8 text-blue-800 text-center">
            Latest Job Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs
                .slice(0, Math.ceil(filteredJobs.length / 2))
                .map((job) => (
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
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-800">
            Ready to Take the Next Step?
          </h2>
          <p className="text-xl text-blue-600 mb-8 max-w-2xl mx-auto">
            Browse all available positions and find the perfect match for your
            skills and experience.
          </p>
          <Link
            to="/all-jobs"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-md transition-colors shadow-md hover:shadow-lg"
          >
            View All Jobs
          </Link>
        </div>
      </section>

      <Footer />

      {/* Login Modal */}
      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}

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
