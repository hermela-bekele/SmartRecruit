import { useState, useEffect } from 'react';
import settingsService from '../../../services/settings.service';
import { toast } from 'react-toastify';
import { useAuth } from '../../../contexts/AuthContext';

export default function NotificationsTab() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    newApplication: true,
    statusChange: true,
    interviewReminders: true,
    weeklyDigest: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load notification preferences from user data
  useEffect(() => {
    if (user?.user) {
      setNotifications({
        newApplication: user.user.newApplicationNotifications ?? true,
        statusChange: user.user.statusChangeNotifications ?? true,
        interviewReminders: user.user.interviewReminderNotifications ?? true,
        weeklyDigest: user.user.weeklyDigestNotifications ?? false
      });
    }
    setIsLoading(false);
  }, [user]);

  const handleToggle = (notificationType) => {
    setNotifications(prev => ({
      ...prev,
      [notificationType]: !prev[notificationType]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const notificationSettings = {
        newApplicationNotifications: notifications.newApplication,
        statusChangeNotifications: notifications.statusChange,
        interviewReminderNotifications: notifications.interviewReminders,
        weeklyDigestNotifications: notifications.weeklyDigest
      };

      await settingsService.updateNotifications(notificationSettings);
      toast.success('Notification preferences saved successfully');
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast.error(error.message || 'Failed to save notification preferences');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br bg-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-1 text-left">Email Notifications</h2>
            <p className="text-gray-600 mb-1 text-left">Configure when you'll receive email notifications</p>
          </div>

          <div className="space-y-6">
            {/* Notification Items */}
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex-1 mr-4">
                <h3 className="text-base font-medium text-gray-900 mb-1 text-left">New Application</h3>
                <p className="text-sm text-gray-500 mt-1 mb-1 text-left">
                  Receive an email when a new application is submitted
                </p>
              </div>
              <button
                onClick={() => handleToggle('newApplication')}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                  notifications.newApplication ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                    notifications.newApplication ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex-1 mr-4">
                <h3 className="text-base font-medium text-gray-900 mb-1 text-left">Application Status Change</h3>
                <p className="text-sm text-gray-500 mt-1 mb-1 text-left">
                  Receive an email when an application status changes
                </p>
              </div>
              <button
                onClick={() => handleToggle('statusChange')}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                  notifications.statusChange ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                    notifications.statusChange ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex-1 mr-4">
                <h3 className="text-base font-medium text-gray-900 mb-1 text-left">Interview Reminders</h3>
                <p className="text-sm text-gray-500 mt-1 mb-1 text-left">
                  Receive reminders for upcoming interviews
                </p>
              </div>
              <button
                onClick={() => handleToggle('interviewReminders')}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                  notifications.interviewReminders ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                    notifications.interviewReminders ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex-1 mr-4">
                <h3 className="text-base font-medium text-gray-900 mb-1 text-left">Weekly Digest</h3>
                <p className="text-sm text-gray-500 mt-1 mb-1 text-left">
                  Receive a weekly summary of application activity
                </p>
              </div>
              <button
                onClick={() => handleToggle('weeklyDigest')}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                  notifications.weeklyDigest ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                    notifications.weeklyDigest ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}