"use client"

import { useState } from "react"

 function DashboardHeader() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [timeFilter, setTimeFilter] = useState("This Week")

  return (
    <header className="flex h-16 items-center justify-between border-b px-6 bg-white">
      <div className="flex items-center gap-4">
        <button className="p-1 rounded-md hover:bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
        </button>
        <h1 className="text-xl font-semibold">Dashboard Overview</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Time Period Selector */}
        <div className="relative">
          <button
            onClick={() => setTimeFilter((prev) => (prev === "This Week" ? "This Month" : "This Week"))}
            className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            <span>{timeFilter}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-1.5 rounded-md hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-blue-600"></span>
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-md border bg-white p-2 shadow-lg">
              <div className="mb-2 px-2 py-1.5">
                <h3 className="font-medium">Notifications</h3>
              </div>
              <div className="space-y-1">
                <button className="w-full rounded-md p-2 text-left text-sm hover:bg-gray-100">
                  <div className="font-medium">New application received</div>
                  <div className="text-xs text-gray-500">2 minutes ago</div>
                </button>
                <button className="w-full rounded-md p-2 text-left text-sm hover:bg-gray-100">
                  <div className="font-medium">Interview scheduled</div>
                  <div className="text-xs text-gray-500">1 hour ago</div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="h-9 w-9 overflow-hidden rounded-full bg-gray-200"
          >
            <img src="/placeholder.svg?height=36&width=36" alt="User avatar" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md border bg-white p-1 shadow-lg">
              <div className="border-b px-3 py-2">
                <div className="font-medium">My Account</div>
              </div>
              <div className="py-1">
                <button className="w-full rounded-md px-3 py-1.5 text-left text-sm hover:bg-gray-100">Profile</button>
                <button className="w-full rounded-md px-3 py-1.5 text-left text-sm hover:bg-gray-100">Settings</button>
                <button className="w-full rounded-md px-3 py-1.5 text-left text-sm hover:bg-gray-100">Sign out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader;
