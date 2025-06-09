import { X, Briefcase, MapPin, DownloadCloud } from "react-feather";
import { downloadResume } from "../../../api/applications";

function CandidateDetailsModal({ isOpen, onClose, candidate }) {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {candidate.name}
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-slate-600 flex items-center gap-1">
                  <Briefcase size={16} /> {candidate.position}
                </span>
                <span className="text-slate-600 flex items-center gap-1">
                  <MapPin size={16} /> {candidate.company}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="text-slate-900">{candidate.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="text-slate-900">{candidate.phone || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">
                  Skills & Experience
                </h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">
                  Application Timeline
                </h4>
                <div className="space-y-4">
                  {candidate.timeline?.map((event, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-slate-900">{event.date}</p>
                        <p className="text-sm text-slate-500">{event.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">
                  Documents
                </h4>
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const button = e.currentTarget;
                    const originalText = button.innerHTML;
                    try {
                      button.innerHTML = `
                        <svg class="animate-spin h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Downloading...
                      `;
                      await downloadResume(candidate.id);
                    } catch (error) {
                      console.error('Error downloading resume:', error);
                      alert('Failed to download resume. Please try again.');
                    } finally {
                      button.innerHTML = originalText;
                    }
                  }}
                  className="text-purple-600 hover:text-purple-800 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-50"
                >
                  <DownloadCloud size={18} />
                  Download Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateDetailsModal; 