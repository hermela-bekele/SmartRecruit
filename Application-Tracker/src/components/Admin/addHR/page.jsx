import Sidebar from "../../sidebar";
import { useState } from "react";

const AddHrPage = () => {
  const [hrDetails, setHrDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
    department: "",
    password: "",
    permissions: {
      viewCandidates: true,
      manageJobPostings: false,
      manageSettings: false
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to save HR details to your backend
    console.log('HR Details:', hrDetails);
    // Reset form after submission
    setHrDetails({
      firstName: "",
      lastName: "",
      email: "",
      jobTitle: "",
      department: "",
      password: "",
      permissions: {
        viewCandidates: true,
        manageJobPostings: false,
        manageSettings: false
      }
    });
  };

  return (
    <div className="min-h-screen flex bg-slate-50/5">
      <Sidebar />
      <div className="ml-42 flex-1 min-h-screen p-10">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-left">Add New HR Account</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 text-left">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={hrDetails.firstName}
                    onChange={(e) => setHrDetails({...hrDetails, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={hrDetails.lastName}
                    onChange={(e) => setHrDetails({...hrDetails, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 text-left">Account Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={hrDetails.email}
                    onChange={(e) => setHrDetails({...hrDetails, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={hrDetails.password}
                    onChange={(e) => setHrDetails({...hrDetails, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Job Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 text-left">Job Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Job Title
                  </label>
                  <input
                    type="text"
                    required
                    value={hrDetails.jobTitle}
                    onChange={(e) => setHrDetails({...hrDetails, jobTitle: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Department
                  </label>
                  <select
                    value={hrDetails.department}
                    onChange={(e) => setHrDetails({...hrDetails, department: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Department</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Recruitment">Recruitment</option>
                    <option value="Talent Acquisition">Talent Acquisition</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 text-left">Account Permissions</h2>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={hrDetails.permissions.viewCandidates}
                    onChange={(e) => setHrDetails({
                      ...hrDetails,
                      permissions: {
                        ...hrDetails.permissions,
                        viewCandidates: e.target.checked
                      }
                    })}
                    className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 text-left">View Candidates</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={hrDetails.permissions.manageJobPostings}
                    onChange={(e) => setHrDetails({
                      ...hrDetails,
                      permissions: {
                        ...hrDetails.permissions,
                        manageJobPostings: e.target.checked
                      }
                    })}
                    className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 mb-1 text-left">Manage Job Postings</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={hrDetails.permissions.manageSettings}
                    onChange={(e) => setHrDetails({
                      ...hrDetails,
                      permissions: {
                        ...hrDetails.permissions,
                        manageSettings: e.target.checked
                      }
                    })}
                    className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 mb-1 text-left">Manage Settings</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create HR Account
              </button>
            </div>
          </form>
        </div>

        {/* Existing HR Accounts List */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-left">Existing HR Accounts</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 bg-gray-50"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Sample data - replace with dynamic data from your backend */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                  <td className="px-6 py-4 whitespace-nowrap">john@company.com</td>
                  <td className="px-6 py-4 whitespace-nowrap">HR Manager</td>
                  <td className="px-6 py-4 whitespace-nowrap">Human Resources</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </button>
                    <button className="ml-4 text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHrPage;