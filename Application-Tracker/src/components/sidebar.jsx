import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, LogOut, User } from "lucide-react";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Add any logout logic here (clear tokens, etc)
    navigate("/"); // Navigate to home page
  };

  const user = {
    name: "John Doe",
    email: "john@company.com",
    avatar: "JD",
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      path: "/dashboard",
    },
    {
      name: "Candidates",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      path: "/applications",
    },
    {
      name: "Jobs",
      icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      path: "/jobs",
    },
    {
      name: "Manage HR",
      icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      path: "/add-hr",
    },
    {
      name: "Settings",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
      path: "/settings",
    },
  ];

  return (
    <motion.div
      animate={{
        width: isCollapsed ? 80 : 288,
        x: window.innerWidth < 640 && !isCollapsed ? -288 : 0,
      }}
      className="fixed left-0 top-0 bottom-0 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl z-50 border-r border-slate-700/50 overflow-hidden"
    >
      {/* Mobile menu toggle button */}
      <button
        className="sm:hidden absolute top-4 right-4 z-50 p-2 rounded-lg bg-slate-800 hover:bg-slate-700"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <ChevronRight size={20} className="text-slate-400" />
      </button>
      <div className="h-full flex flex-col">
        {/* Collapse Button */}
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`hidden sm:block  absolute top-9 ${
            isCollapsed ? "left-1/2 -translate-x-12" : "right-0"
          } z-50 p-1.5 rounded-lg hover:bg-slate-700/40 transition-colors`}
          initial={false}
          animate={{
            rotate: isCollapsed ? 180 : 0,
          }}
        >
          {isCollapsed ? (
            <ChevronLeft size={20} className="text-slate-400" />
          ) : (
            <ChevronLeft size={20} className="text-slate-400" />
          )}
        </motion.button>

        {/* Mobile overlay when sidebar is open */}
        {window.innerWidth < 640 && !isCollapsed && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsCollapsed(true)}
          />
        )}

        {/* Logo Section */}
        <motion.div
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          className="p-6 pt-8"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            SmartRecruit
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-light">
            Hiring Intelligence Platform
          </p>
        </motion.div>

        {/* Compact Logo for Collapsed State */}
        <motion.div
          animate={{ opacity: isCollapsed ? 1 : 0 }}
          className="absolute top-8 left-0 right-0 flex justify-center"
        >
          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <span className="text-purple-400 font-bold text-xl">SR</span>
          </div>
        </motion.div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <Link
                to={item.path}
                className={`flex items-center justify-center sm:justify-start p-3 rounded-xl transition-all group ${
                  location.pathname === item.path
                    ? "bg-purple-500/20 border border-purple-500/30 shadow-lg"
                    : "hover:bg-slate-700/30 border border-transparent"
                }`}
              >
                <svg
                  className={`w-6 h-6 ${
                    location.pathname === item.path
                      ? "text-purple-400"
                      : "text-slate-400 group-hover:text-purple-300"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d={item.icon}
                  />
                </svg>

                {/* Text with hover effect */}
                <motion.span
                  animate={{
                    opacity: isCollapsed ? 0 : 1,
                    marginLeft: isCollapsed ? -100 : 16,
                  }}
                  className={`hidden sm:inline ${
                    location.pathname === item.path
                      ? "text-purple-200 font-medium"
                      : "text-slate-300 group-hover:text-white font-normal"
                  }`}
                >
                  {item.name}
                </motion.span>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Hover Tooltips */}
        {isCollapsed && (
          <div className="absolute left-full top-0 ml-4 w-48 pointer-events-none">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute px-4 py-2 bg-slate-800 text-slate-200 rounded-lg shadow-lg text-sm"
                style={{ top: `${navItems.indexOf(item) * 56 + 160}px` }}
              >
                {item.name}
              </motion.div>
            ))}
          </div>
        )}

        {/* Profile & Logout Section */}
        <div className="mt-auto border-t border-slate-700/50 p-4">
          <motion.div
            className={`flex items-center gap-1 p-2 rounded-lg hover:bg-slate-700/30 transition-colors cursor-pointer ${
              isCollapsed ? "justify-center" : ""
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
              <span className="text-purple-400 font-medium">{user.avatar}</span>
            </div>

            <motion.div
              animate={{ opacity: isCollapsed ? 0 : 1 }}
              className={`overflow-hidden ${isCollapsed ? "w-0" : "w-auto"}`}
            >
              <p className="text-slate-200 font-medium truncate text-left">
                {user.name}
              </p>
              <p className="text-slate-400 text-sm truncate">{user.email}</p>
            </motion.div>
          </motion.div>

          <motion.button
            onClick={handleLogout}
            className={`w-full mt-4 flex items-center gap-3 p-2 rounded-lg text-slate-300 hover:text-purple-300 hover:bg-slate-700/30 transition-colors ${
              isCollapsed ? "justify-center" : "pl-3"
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <LogOut size={20} />
            <motion.span
              animate={{ opacity: isCollapsed ? 0 : 1 }}
              className={`${isCollapsed ? "hidden" : "block"}`}
            >
              Log Out
            </motion.span>
          </motion.button>

          {/* Collapsed State Tooltips */}
          {isCollapsed && (
            <div className="absolute left-full bottom-4 ml-4 w-48 pointer-events-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg shadow-lg text-sm"
              >
                {user.name}
                <div className="text-slate-400 text-xs mt-1">{user.email}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 py-2 mt-2 bg-slate-800 text-slate-200 rounded-lg shadow-lg text-sm"
              >
                Log Out
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
