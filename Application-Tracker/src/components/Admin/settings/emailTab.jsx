// EmailTemplatesTab.jsx
import { useState, useEffect } from "react";

export default function EmailTemplatesTab() {
  const [templates, setTemplates] = useState({
    Received: "",
    Interview: "",
    Reject: "",
    Offer: ""
  });

  useEffect(() => {
    const savedTemplates = JSON.parse(localStorage.getItem('emailTemplates')) || {
    Received: `Dear ((candidate_name)),\n\nThank you for applying for the ((position)) role at ((company_name)). We have received your application and will review it shortly.\n\nBest regards,\n((company_name)) Recruitment Team`,
    Interview: `Dear ((candidate_name)),\n\nWe would like to invite you for an interview for the ((position)) role. Please let us know your availability for the coming week.\n\nBest regards,\n((company_name)) Recruitment Team`,
    Reject: `Dear ((candidate_name)),\n\nThank you for your interest in the ((position)) role at ((company_name)). After careful consideration, we have decided to move forward with other candidates whose qualifications better match our current needs.\n\nBest regards,\n((company_name)) Recruitment Team`,
    Offer: `Dear ((candidate_name)),\n\nWe are pleased to offer you the position of ((position)) at ((company_name)). Please find attached the formal offer letter with all the details.\n\nBest regards,\n((company_name)) Recruitment Team`
    };
    setTemplates(savedTemplates);
  }, []);

  const handleSave = () => {
    localStorage.setItem('emailTemplates', JSON.stringify(templates));
    console.log('Templates saved:', templates);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Email Templates</h2>
        <p className="text-gray-600">Customize the email templates sent to candidates</p>
      </div>

      <div className="space-y-8">
        {Object.entries(templates).map(([status, content]) => (
          <div key={status} className="border-b border-gray-200 pb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">{status}</h3>
            <textarea
              value={content}
              onChange={(e) => setTemplates(prev => ({
                ...prev,
                [status]: e.target.value
              }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all h-48 font-mono text-sm"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          Save Templates
        </button>
      </div>
    </div>
  );
}