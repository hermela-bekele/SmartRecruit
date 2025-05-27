import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import Sidebar from "../../sidebar";
import { ChevronDown, Download, Plus, Filter } from "react-feather";

function Dashboard() {

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

  // Data definitions
  const positions = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      count: 18,
      days: 3,
    },
    { title: "Product Manager", department: "Product", count: 12, days: 5 },
    { title: "UX Designer", department: "Design", count: 9, days: 7 },
  ];

  const statuses = [
    { label: "Received", percentage: 38, color: "bg-purple-500" },
    { label: "Under Review", percentage: 35, color: "bg-blue-500" },
    { label: "Interview", percentage: 14, color: "bg-green-500" },
    { label: "Offer", percentage: 7, color: "bg-yellow-500" },
    { label: "Rejected", percentage: 6, color: "bg-rose-500" },
  ];

  const reports = [
    {
      title: "Monthly Hiring Report",
      date: "2024-03-01",
      type: "PDF",
      size: "2.4MB",
    },
    {
      title: "Q1 Recruitment Analysis",
      date: "2024-04-15",
      type: "CSV",
      size: "1.1MB",
    },
    {
      title: "Candidate Diversity Report",
      date: "2024-04-20",
      type: "PDF",
      size: "3.2MB",
    },
  ];

  const quickStats = [
    {
      title: "Avg. Time to Hire",
      value: "28",
      change: "-2d",
      color: "bg-slate-800",
    },
    {
      title: "Cost per Hire",
      value: "$4,200",
      change: "-12%",
      color: "bg-slate-800",
    },
    {
      title: "Offer Acceptance",
      value: "82%",
      change: "+5%",
      color: "bg-slate-800",
    },
  ];

  const tableData = [
    {
      position: "Frontend Dev",
      applied: 45,
      interviewing: 12,
      offered: 3,
      rejected: 30,
    },
    {
      position: "Product Manager",
      applied: 32,
      interviewing: 8,
      offered: 2,
      rejected: 22,
    },
    {
      position: "UX Designer",
      applied: 28,
      interviewing: 6,
      offered: 1,
      rejected: 21,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50/5">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div 
        className={`flex-1 min-h-screen p-4 md:p-6 lg:p-10 transition-all duration-300 ${
          !isMobile ? (isCollapsed ? 'md:ml-20' : 'md:ml-72') : ''
        }`}
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6  gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">
              Talent Analytics Dashboard
            </h1>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 w-full md:w-auto">
                <Filter size={16} className="text-slate-600" />
                <select className="bg-transparent text-slate-600 text-sm md:text-base">
                  <option>Last 30 days</option>
                  <option>Last quarter</option>
                  <option>Year to date</option>
                </select>
                <ChevronDown size={16} className="text-slate-400" />
              </div>
              <button className="w-full md:w-auto flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors justify-center">
                <Plus size={16} />
                <span className="text-sm md:text-base">Generate Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Combined Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {[
            {
              title: "Applications",
              value: 24,
              change: "+12%",
              color: "bg-purple-500",
            },
            {
              title: "Interviews",
              value: 8,
              change: "+5%",
              color: "bg-blue-500",
            },
            { title: "Offers", value: 4, change: "+2%", color: "bg-green-500" },
            {
              title: "Rejected",
              value: 12,
              change: "-3%",
              color: "bg-rose-500",
            },
            ...quickStats,
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white p-4 md:p-6 rounded-xl shadow-sm md:shadow-lg border border-slate-200/50 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs md:text-sm text-slate-500 mb-1 md:mb-2">
                    {stat.title}
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`${stat.color} w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center`}
                >
                  <div className="w-4 h-4 md:w-6 md:h-6 bg-white/30 rounded-full backdrop-blur-sm" />
                </div>
              </div>
              <div className="mt-2 md:mt-4 flex items-center gap-1">
                <span
                  className={`text-xs md:text-sm ${
                    stat.change.startsWith("+")
                      ? "text-green-600"
                      : "text-rose-600"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-slate-400 text-xs">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Open Positions Section */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm md:shadow-lg border border-slate-200/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-2">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900">
                  Open Positions
                </h2>
                <p className="text-xs md:text-sm text-slate-500">
                  7 active job postings
                </p>
              </div>
              <button className="text-purple-600 hover:bg-slate-50 px-2 py-1 rounded-lg text-sm md:text-base">
                View All →
              </button>
            </div>
            <div className="space-y-2 md:space-y-4">
              {positions.map((position, index) => (
                <div
                  key={index}
                  className="p-3 md:p-4 bg-slate-50/50 rounded-lg hover:bg-slate-100/30 transition-colors"
                >
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex-1">
                      <h3 className="text-sm md:text-base font-semibold text-slate-900">
                        {position.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-slate-500">
                          {position.department}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs md:text-sm text-sky-600 font-medium">
                          {position.count} candidates
                        </span>
                      </div>
                    </div>
                    <div className="text-right min-w-[70px]">
                      <div className="text-base md:text-lg font-bold text-slate-900">
                        {position.days}d
                      </div>
                      <div
                        className={`text-xs ${
                          position.days <= 3
                            ? "text-rose-500"
                            : "text-slate-400"
                        }`}
                      >
                        remaining
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Pipeline Section */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm md:shadow-lg border border-slate-200/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-2">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900">
                  Application Pipeline
                </h2>
                <p className="text-xs md:text-sm text-slate-500">
                  Candidate distribution
                </p>
              </div>
              <div className="flex gap-1">
                <button className="p-1 md:p-2 hover:bg-slate-50 rounded-lg">
                  <span className="sr-only">Refresh</span>
                  <span aria-hidden>🔄</span>
                </button>
                <button className="p-1 md:p-2 hover:bg-slate-50 rounded-lg">
                  <span className="sr-only">Expand</span>
                  <span aria-hidden>⤢</span>
                </button>
              </div>
            </div>
            {/* Pie Chart Container */}
            <div className="relative h-48 md:h-64 flex items-center justify-center">
              <div
                className="w-32 h-32 md:w-40 md:h-40 rounded-full relative"
                style={{
                  background: `conic-gradient(
                    #8b5cf6 0% 38%,
                    #3b82f6 38% 73%,
                    #22c55e 73% 87%,
                    #eab308 87% 94%,
                    #ef4444 94% 100%
                  )`,
                }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 bg-white rounded-full shadow-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg md:text-2xl font-bold text-slate-900">
                      127
                    </div>
                    <div className="text-xs md:text-sm text-slate-500">Total</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 mt-4 md:mt-6">
              {statuses.map((status, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 md:p-3 bg-slate-50/50 rounded-lg"
                >
                  <div className={`w-3 h-3 rounded-full ${status.color}`} />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-slate-600">{status.label}</span>
                      <span className="text-slate-900 font-medium">
                        {status.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${status.percentage}%`,
                          backgroundColor: status.color.replace("bg-", ""),
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-xl shadow-sm md:shadow-lg border border-slate-200/50 mb-6 md:mb-8">
          <div className="p-4 md:p-6 border-b border-slate-200">
            <h2 className="text-lg md:text-xl font-bold text-slate-900">
              Candidate Pipeline
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-slate-50 text-slate-600 text-xs md:text-sm">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left">Position</th>
                  <th className="px-4 md:px-6 py-3 text-right">Applied</th>
                  <th className="px-4 md:px-6 py-3 text-right">Interviewing</th>
                  <th className="px-4 md:px-6 py-3 text-right">Offered</th>
                  <th className="px-4 md:px-6 py-3 text-right">Rejected</th>
                  <th className="px-4 md:px-6 py-3 text-right">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 md:px-6 py-3 font-medium text-sm md:text-base">
                      {row.position}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-right">
                      {row.applied}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-right">
                      {row.interviewing}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-right">
                      {row.offered}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-right">
                      {row.rejected}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-right text-green-600 font-medium">
                      {((row.offered / row.applied) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Reports Section */}
        <div className="bg-white rounded-xl shadow-sm md:shadow-lg border border-slate-200/50">
          <div className="p-4 md:p-6 border-b border-slate-200">
            <h2 className="text-lg md:text-xl font-bold text-slate-900">
              Recent Reports
            </h2>
          </div>
          <div className="p-4 md:p-6 grid gap-2 md:gap-4">
            {reports.map((report, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 md:p-4 hover:bg-slate-50 rounded-lg"
              >
                <div className="flex-1 mb-2 md:mb-0">
                  <h3 className="text-sm md:text-base font-medium text-slate-900">
                    {report.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500">
                    {report.date} • {report.type}
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <span className="text-xs md:text-sm text-slate-500">
                    {report.size}
                  </span>
                  <button className="text-purple-600 hover:bg-slate-100 p-1 md:p-2 rounded-lg">
                    <Download size={16} className="md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
