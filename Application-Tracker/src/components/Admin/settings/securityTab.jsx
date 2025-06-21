import { useState } from "react";
import settingsService from "../../../services/settings.service";
import { toast } from "react-toastify";

export default function SecurityTab() {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdating2FA, setIsUpdating2FA] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFASecret, setTwoFASecret] = useState("");

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwords.new.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsChangingPassword(true);
    try {
      await settingsService.changePassword({
        oldPassword: passwords.current,
        newPassword: passwords.new,
      });
      
      toast.success("Password changed successfully");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handle2FAToggle = async () => {
    if (twoFactorEnabled) {
      // Disable 2FA
      setIsUpdating2FA(true);
      try {
        await settingsService.disable2FA();
        setTwoFactorEnabled(false);
        toast.success("Two-factor authentication disabled");
      } catch (error) {
        console.error("Error disabling 2FA:", error);
        toast.error(error.message || "Failed to disable 2FA");
      } finally {
        setIsUpdating2FA(false);
      }
    } else {
      // Enable 2FA
      setIsUpdating2FA(true);
      try {
        const result = await settingsService.enable2FA();
        setTwoFASecret(result.secret);
        setShow2FASetup(true);
        toast.info("Please scan the QR code and enter the verification code");
      } catch (error) {
        console.error("Error enabling 2FA:", error);
        toast.error(error.message || "Failed to enable 2FA");
      } finally {
        setIsUpdating2FA(false);
      }
    }
  };

  const handle2FAVerification = async () => {
    if (!twoFACode || twoFACode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsUpdating2FA(true);
    try {
      await settingsService.verify2FA(twoFACode);
      setTwoFactorEnabled(true);
      setShow2FASetup(false);
      setTwoFACode("");
      setTwoFASecret("");
      toast.success("Two-factor authentication enabled successfully");
    } catch (error) {
      console.error("Error verifying 2FA:", error);
      toast.error(error.message || "Invalid verification code");
    } finally {
      setIsUpdating2FA(false);
    }
  };

  const cancel2FASetup = () => {
    setShow2FASetup(false);
    setTwoFACode("");
    setTwoFASecret("");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Change Password Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1 text-left">
          Change Password
        </h2>

        <div className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Current Password
            </label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              New Password
            </label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
            <p className="text-sm text-gray-500 mt-1">
              Password must be at least 8 characters long
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-start">
          <button
            onClick={handlePasswordChange}
            disabled={isChangingPassword || !passwords.current || !passwords.new || !passwords.confirm}
            className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChangingPassword ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication Section */}
      <div className="pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1 text-left">
          Two-Factor Authentication
        </h2>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1 mr-4">
            <h3 className="text-base font-medium text-gray-900 mb-1 text-left">
              Enable Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-1 text-left">
              Protect your account with an additional security layer
            </p>
          </div>
          <button
            onClick={handle2FAToggle}
            disabled={isUpdating2FA}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
              twoFactorEnabled ? "bg-indigo-600" : "bg-gray-200"
            } disabled:opacity-50`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                twoFactorEnabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* 2FA Setup Modal */}
        {show2FASetup && (
          <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-medium text-blue-900 mb-4">
              Set Up Two-Factor Authentication
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-blue-800 mb-2">
                  1. Scan this QR code with your authenticator app:
                </p>
                <div className="bg-white p-4 rounded border inline-block">
                  <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                    QR Code Placeholder
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-blue-800 mb-2">
                  2. Or manually enter this secret key:
                </p>
                <code className="block bg-white p-2 rounded border text-sm font-mono">
                  {twoFASecret}
                </code>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-900 mb-1">
                  3. Enter the 6-digit code from your app:
                </label>
                <input
                  type="text"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={6}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handle2FAVerification}
                  disabled={isUpdating2FA || twoFACode.length !== 6}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isUpdating2FA ? "Verifying..." : "Verify & Enable"}
                </button>
                <button
                  onClick={cancel2FASetup}
                  disabled={isUpdating2FA}
                  className="px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
