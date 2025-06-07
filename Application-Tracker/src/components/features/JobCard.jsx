import { Calendar, MapPin } from "lucide-react";
export default function JobCard({ job, onApply }) {
    const formattedDate = new Date(job.postingDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  
    return (
      <div className="bg-white border border-blue-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 relative">
        {/* Closed Banner */}
        {job.status === "Closed" && (
          <div className="absolute top-0 left-0 right-0 bg-gray-800 text-white text-center py-2 rounded-t-xl">
            This position is no longer accepting applications
          </div>
        )}
        
        <div className={`p-6 ${job.status === "Closed" ? "pt-12" : ""}`}>
          <h3 className="text-xl font-bold text-blue-800 mb-2">{job.title}</h3>
          <p className="text-blue-600 font-medium mb-4">{job.company}</p>
  
          <div className="flex items-center text-blue-600 mb-2">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{job.location}</span>
          </div>
  
          <div className="flex items-center text-blue-600 mb-4">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Posted {formattedDate}</span>
          </div>
  
          <div className="mb-4 flex gap-2">
            <span className="inline-block bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded">
              {job.employmentType}
            </span>
            <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded ${
              job.status === "Closed" 
                ? "bg-gray-100 text-gray-600"
                : "bg-green-100 text-green-600"
            }`}>
              {job.status || "Active"}
            </span>
          </div>
  
          <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
  
          <button
            className={`w-full py-2 px-4 font-medium rounded-md transition-colors shadow-md ${
              job.status === "Closed"
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
            }`}
            onClick={job.status !== "Closed" ? onApply : undefined}
            disabled={job.status === "Closed"}
          >
            {job.status === "Closed" ? "Position Closed" : "Apply Now"}
          </button>
        </div>
      </div>
    );
  }