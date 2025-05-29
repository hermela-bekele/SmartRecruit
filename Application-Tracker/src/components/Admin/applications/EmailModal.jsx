// EmailModal.jsx
import { useState, useEffect } from "react";
import { X } from 'lucide-react';

export default function EmailModal({ 
  isOpen, 
  onClose, 
  candidate, 
  template, 
  status, 
  onSend 
}) {
  const [emailContent, setEmailContent] = useState("");
  const [subject, setSubject] = useState("");

  useEffect(() => {
    if (isOpen && template && candidate) {
      const populatedContent = template
        .replace(/\(\(candidate_name\)\)/g, candidate.name)
        .replace(/\(\(position\)\)/g, candidate.position)
        .replace(/\(\(company_name\)\)/g, candidate.company); 

      setEmailContent(populatedContent);
      
      const subjects = {
        Received: `Application Received Confirmation - ${candidate.company}`,
        Interview: `${candidate.company} Interview Invitation`,
        Reject: `Application Update from ${candidate.company}`,
        Offer: `${candidate.company} Job Offer`
      };
      setSubject(subjects[status] || "Important Update Regarding Your Application");
    }
  }, [isOpen, template, candidate, status]);

  if (!isOpen || !candidate) return null;

  return (
    <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-slate-900">
              Send {status} Email to {candidate.name}
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Content</label>
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
              />
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <button onClick={onClose} className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                Cancel
              </button>
              <button 
                onClick={() => {
                  onSend(emailContent, subject);
                  onClose();
                }}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}