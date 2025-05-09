//import { useState } from "react";
import ApplicationForm from "./applicationForm";
import { X, Calendar, MapPin, ArrowLeft, Upload } from "lucide-react";

export default function JobDetailsModal({
    job,
    onClose,
    showApplicationForm,
    setShowApplicationForm,
  }) {
    // Format date to be more readable
    const formattedDate = new Date(job.postedDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  
    // Extended job description for the modal
    const fullDescription = `
      ${job.description}
      
      We are looking for a talented professional to join our team. The ideal candidate will have a strong background in the field and be passionate about making an impact.
      
      Responsibilities:
      • Develop and maintain high-quality solutions
      • Collaborate with cross-functional teams
      • Stay up-to-date with industry trends
      • Participate in code reviews and technical discussions
      
      Requirements:
      • 3+ years of relevant experience
      • Strong problem-solving skills
      • Excellent communication abilities
      • Bachelor's degree in a related field or equivalent experience
      
      Benefits:
      • Competitive salary
      • Health insurance
      • Flexible work arrangements
      • Professional development opportunities
    `;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-blue-100">
          <div className="p-6">
            {!showApplicationForm ? (
              <>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-blue-800">
                    {job.title}
                  </h2>
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={onClose}
                  >
                    <X size={24} />
                  </button>
                </div>
  
                <div className="mt-4">
                  <h3 className="text-xl text-blue-600 font-medium mb-4">
                    {job.company}
                  </h3>
  
                  <div className="flex flex-col gap-2 mt-4 text-blue-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{job.location}</span>
                    </div>
  
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Posted {formattedDate}</span>
                    </div>
                  </div>
  
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2 text-blue-800">
                      Job Description
                    </h4>
                    <div className="whitespace-pre-line text-gray-600 text-left">
                      {fullDescription}
                    </div>
                  </div>
  
                  <div className="mt-8">
                    <button
                      className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-md hover:shadow-lg"
                      onClick={() => setShowApplicationForm(true)}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <ApplicationForm
                job={job}
                onBack={() => setShowApplicationForm(false)}
                onSubmitSuccess={onClose}
              />
            )}
          </div>
        </div>
      </div>
    );
  }