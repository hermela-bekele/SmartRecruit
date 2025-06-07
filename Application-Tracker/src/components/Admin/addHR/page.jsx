import Sidebar from "../../sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAuthHeader } from "../../../utils/auth";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const AddHrPage = () => {
  const [hrDetails, setHrDetails] = useState({
    email: "",
    password: "",
    role: "HR_ADMIN"
  });

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [existingUsers, setExistingUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch existing users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const headers = getAuthHeader();
    if (!headers) {
      toast.error('Authentication token not found');
      navigate('/login');
      return;
    }

    try {
      console.log('Fetching users...');
      const response = await axios.get(`${API_URL}/users`, { headers });
      console.log('Users response:', response.data);
      setExistingUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error.response || error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch existing users');
      }
    }
  };

  const handleEditUser = async (user) => {
    try {
      console.log('Editing user:', user);
      setEditingUser(user);
      setHrDetails({
        email: user.email,
        password: '', // Password is not editable for existing users
        role: user.role
      });
    } catch (error) {
      console.error('Error in handleEditUser:', error);
      toast.error('Failed to prepare user edit');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setHrDetails({
      email: "",
      password: "",
      role: "HR_ADMIN"
    });
  };

  const handleDeleteUser = async (userId) => {
    const headers = getAuthHeader();
    if (!headers) return;

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        console.log('Deleting user with ID:', userId);
        await axios.delete(`${API_URL}/users/${userId}`, { headers });
        toast.success('User deleted successfully');
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error('Error deleting user:', error.response || error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          navigate('/login');
        } else {
          toast.error(error.response?.data?.message || 'Failed to delete user');
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = getAuthHeader();
    if (!headers) return;

    setIsLoading(true);

    try {
      if (editingUser) {
        // Update existing user - only email and role can be updated
        const updateData = {
          email: hrDetails.email,
          role: hrDetails.role
        };

        console.log('Updating user:', editingUser.id, updateData);
        await axios.patch(`${API_URL}/users/${editingUser.id}`, updateData, { headers });
        toast.success('User updated successfully');
        setEditingUser(null);
      } else {
        // Create new user with welcome email flag
        console.log('Creating new user:', hrDetails);
        await axios.post(`${API_URL}/users`, {
          ...hrDetails,
          sendWelcomeEmail: true // Add this flag to indicate welcome email should be sent
        }, { headers });
        toast.success('HR account created successfully and welcome email sent');
      }
      
      // Reset form
      setHrDetails({
        email: "",
        password: "",
        role: "HR_ADMIN"
      });

      // Refresh user list
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error.response || error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to save user');
      }
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50/5">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div 
        className={`flex-1 min-h-screen p-4 md:p-6 lg:p-10 transition-all duration-300 ${
          !isMobile ? (isCollapsed ? 'md:ml-20' : 'md:ml-72') : ''
        }`}
      >
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-left">
            {editingUser ? 'Edit HR Account' : 'Add New HR Account'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
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
                {!editingUser && (
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
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Role
                  </label>
                  <select
                    value={hrDetails.role}
                    onChange={(e) => setHrDetails({...hrDetails, role: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="HR_ADMIN">HR Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 flex justify-between">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
                }`}
              >
                {isLoading ? 'Saving...' : (editingUser ? 'Update Account' : 'Create Account')}
              </button>
              
              {editingUser && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
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
                    Email
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 bg-gray-50"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {existingUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHrPage;