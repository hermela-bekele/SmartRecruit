import { Calendar, MapPin } from "lucide-react";
export default function JobCard({ job, onApply }) {
    const formattedDate = new Date(job.postingDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  
    return (
      <div className="bg-white border border-blue-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="p-6">
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
  
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded ">
              {job.employmentType}
            </span>
          </div>
  
          <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
  
          <button
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-md hover:shadow-lg"
            onClick={onApply}
          >
            Apply Now
          </button>
        </div>
      </div>
    );
  }