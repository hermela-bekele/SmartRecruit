import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import Sidebar from "../../sidebar";
import { ChevronDown, Download, Plus, Filter } from "react-feather";
import { getDashboardStats } from '../../../../src/services/dashboardService';

function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    openPositions: [],
    pipelineData: [],
  });

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

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const { stats, openPositions } = dashboardData;

  // Calculate status percentages for the pie chart
  const totalApplications = stats.totalApplications || 0;
  const statuses = [
    { 
      label: "Under Review", 
      percentage: totalApplications ? Math.round((stats.totalUnderReview / totalApplications) * 100) : 0,
      color: "bg-purple-500" 
    },
    { 
      label: "Interview", 
      percentage: totalApplications ? Math.round((stats.totalInterviews / totalApplications) * 100) : 0,
      color: "bg-blue-500" 
    },
    { 
      label: "Offer", 
      percentage: totalApplications ? Math.round((stats.totalOffers / totalApplications) * 100) : 0,
      color: "bg-green-500" 
    },
    { 
      label: "Hired", 
      percentage: totalApplications ? Math.round((stats.totalHired / totalApplications) * 100) : 0,
      color: "bg-yellow-500" 
    },
    { 
      label: "Rejected", 
      percentage: totalApplications ? Math.round((stats.totalRejected / totalApplications) * 100) : 0,
      color: "bg-rose-500" 
    },
  ];

  const quickStats = [
    {
      title: "Avg. Time to Hire",
      value: `${stats.avgTimeToHire || 0}`,
      change: "-2d",
      color: "bg-slate-800",
    },
    {
      title: "Cost per Hire",
      value: `$${stats.costPerHire || 0}`,
      change: "-12%",
      color: "bg-slate-800",
    },
    {
      title: "Offer Acceptance",
      value: `${stats.offerAcceptanceRate || 0}%`,
      change: "+5%",
      color: "bg-slate-800",
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
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
              value: stats.totalApplications || 0,
              change: "+12%",
              color: "bg-purple-500",
            },
            {
              title: "Under Review",
              value: stats.totalUnderReview || 0,
              change: "+5%",
              color: "bg-blue-500",
            },
            { 
              title: "Interviews", 
              value: stats.totalInterviews || 0, 
              change: "+2%", 
              color: "bg-green-500" 
            },
            {
              title: "Offers",
              value: stats.totalOffers || 0,
              change: "+3%",
              color: "bg-yellow-500",
            },
            {
              title: "Hired",
              value: stats.totalHired || 0,
              change: "+1%",
              color: "bg-emerald-500",
            },
            {
              title: "Rejected",
              value: stats.totalRejected || 0,
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
                  {openPositions.length} active job postings
                </p>
              </div>
              <Link to="/admin/jobs" className="text-purple-600 hover:bg-slate-50 px-2 py-1 rounded-lg text-sm md:text-base">
                View All →
              </Link>
            </div>
            <div className="space-y-2 md:space-y-4">
              {openPositions.map((position, index) => (
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
                    ${statuses.map((status, index) => {
                      const start = index === 0 ? 0 : statuses.slice(0, index).reduce((acc, s) => acc + s.percentage, 0);
                      const end = start + status.percentage;
                      return `${status.color.replace('bg-', '#')} ${start}% ${end}%`;
                    }).join(', ')}
                  )`,
                }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 bg-white rounded-full shadow-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg md:text-2xl font-bold text-slate-900">
                      {totalApplications}
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
      </div>
    </div>
  );
}

export default Dashboard;
