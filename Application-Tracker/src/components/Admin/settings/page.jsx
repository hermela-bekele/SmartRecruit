import { useState } from "react";
import {
  BellIcon,
  ShieldCheckIcon,
  TemplateIcon,
  UserCircleIcon,
} from "@heroicons/react/outline";
import Sidebar from "../../sidebar";
import NotificationsTab from "./notificationTab"; 
import SecurityTab from "./securityTab";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  const navigation = [
    { name: "Profile", id: "profile", icon: UserCircleIcon },
    { name: "Notification", id: "notification", icon: BellIcon },
    { name: "Security", id: "security", icon: ShieldCheckIcon },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <>
            {/* Profile Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-1 text-left">
                  Profile Information
                </h2>
                <p className="text-gray-600 mb-1 text-left">
                  Update your account profile information
                </p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                      First Name
                    </label>
                    <input
                      type="text"
                      defaultValue="HR"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                      Last Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Manager"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="hr@company.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                      Job Title
                    </label>
                    <input
                      type="text"
                      defaultValue="HR Manager"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                      Department
                    </label>
                    <input
                      type="text"
                      defaultValue="Human Resources"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Company Information Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-1 text-left">
                  Company Information
                </h2>
                <p className="text-gray-600 mb-1 text-left">Update your company details</p>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    Company Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Acme Inc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    Website
                  </label>
                  <input
                    type="url"
                    defaultValue="https://acme.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    Address
                  </label>
                  <textarea
                    defaultValue="123 Main St, San Francisco, CA 94105"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all h-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    Company Size
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-select-arrow bg-no-repeat bg-right-4"
                    defaultValue="50-100 employees"
                  >
                    <option>10-50 employees</option>
                    <option>50-100 employees</option>
                    <option>100-500 employees</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm">
                  <p className="font-medium text-indigo-600">HR Manager</p>
                  <p className="text-gray-600">infocompany.com</p>
                </div>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </>
        );
      case "notification":
        return <NotificationsTab />;
      case "security":
        return <SecurityTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50/5">
      <Sidebar />

      <div className="ml-42 flex-1 min-h-screen p-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-left">
            Account Settings
          </h1>
          <nav className="flex space-x-4 border-b border-gray-200">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center px-1 py-4 text-sm font-medium ${
                  activeTab === item.id
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Render dynamic content based on active tab */}
        {renderContent()}
      </div>
    </div>
  );
}
