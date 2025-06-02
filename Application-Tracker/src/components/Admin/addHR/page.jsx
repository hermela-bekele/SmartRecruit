import Sidebar from "../../sidebar";
import { useState, useEffect } from "react";

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

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobile(isMobile);
      if (isMobile) setIsCollapsed(true);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50/5">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div 
        className={`flex-1 min-h-screen p-4 md:p-6 lg:p-10 transition-all duration-300 ${
          !isMobile ? (isCollapsed ? 'md:ml-20' : 'md:ml-72') : ''
        }`}
      >
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
{/*                 <div>
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
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Role
                  </label>
                  <select
                    value={hrDetails.role}
                    onChange={(e) => setHrDetails({...hrDetails, department: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Role</option>
                    <option value="Human Resources">SUPER_ADMIN</option>
                    <option value="Recruitment">HR_ADMIN</option>
                  </select>
                </div>
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