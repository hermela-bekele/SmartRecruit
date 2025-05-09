import { Link } from 'react-router-dom';
import Sidebar from '../../sidebar';
function Dashboard() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content - Full Width */}
      <div className="ml-64 flex-1 min-h-screen bg-gradient from-blue-50 to-blue-100">
        <div className="p-8 max-w-full">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              Dashboard Overview
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-blue-600">Last updated: Today</span>
              <span className="text-blue-400">•</span>
              <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
                3 new updates
              </span>
            </div>
          </div>

          <div className="flex gap-2 md:flex-row mb-8 justify-end w-full">
            <button className="text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50">
              Week
            </button>
            <button className="text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50">
              Month
            </button>
            <button className="text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50">
              Year
            </button>
          </div>

          {/* Stats Grid - Full Width */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 w-full">
            {[
              { title: "Applications", value: 24, change: "+12%" },
              { title: "Interviews", value: 8, change: "+5%" },
              { title: "Offers", value: 4, change: "+2%" },
              { title: "Rejected", value: 12, change: "-3%" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 w-full"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-blue-500 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {stat.value}
                    </p>
                  </div>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      stat.change.startsWith("+")
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Sections - Full Width */}
          <div className="flex flex-col lg:flex-row gap-5 w-full">
            {/* Open Positions */}
            <div className="lg:w-1/2 bg-white p-6 rounded-xl shadow-sm border border-blue-100 h-[calc(100vh-20rem)] overflow-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-blue-900 mb-1">
                    Open Positions
                  </h2>
                  <p className="text-blue-500">7 active job postings</p>
                </div>

              </div>

              <div className="space-y-3">
                {[
                  {
                    title: "Senior Frontend Developer",
                    department: "Engineering",
                    count: 18,
                    days: 3,
                  },
                  {
                    title: "Product Manager",
                    department: "Product",
                    count: 12,
                    days: 5,
                  },
                  {
                    title: "UX Designer",
                    department: "Design",
                    count: 9,
                    days: 7,
                  },
                ].map((position, index) => (
                  <div
                    key={index}
                    className="p-4 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-blue-900">
                          {position.title}
                        </h3>
                        <p className="text-sm text-blue-500">
                          {position.department}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-900">
                          {position.count}
                        </div>
                        <span
                          className={`text-sm ${
                            position.days <= 3
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                        >
                          {position.days} days left
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Status */}
            <div className="lg:w-1/2 bg-white p-6 rounded-xl shadow-sm border border-blue-100 h-[calc(100vh-20rem)] overflow-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-blue-900 mb-1">
                    Application Status
                  </h2>
                  <p className="text-blue-500">
                    Distribution across categories
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Recieved", percentage: 38 },
                  { label: "Under Review", percentage: 35 },
                  { label: "Interview", percentage: 14 },
                  { label: "Offer", percentage: 7 },
                  { label: "Rejected", percentage: 6 },
                ].map((status, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm text-blue-900">
                      <span>{status.label}</span>
                      <span>{status.percentage}%</span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${status.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
