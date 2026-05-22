import React, { useState, useEffect } from 'react';
import UseRole from '../Hooks/UseRole';
import { getUsersByRole, setUserRole } from '../utils/roleUtils';

/**
 * Example Admin Dashboard Component
 * Demonstrates role-based access control and user management
 */
const AdminDashboard = () => {
  const { userRole, isAdmin, loading } = UseRole();
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('user');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch users by selected role
  useEffect(() => {
    if (isAdmin()) {
      fetchUsersByRole();
    }
  }, [selectedRole, isAdmin]);

  const fetchUsersByRole = async () => {
    setLoadingUsers(true);
    try {
      const fetchedUsers = await getUsersByRole(selectedRole);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await setUserRole(userId, newRole);
      // Refresh the list
      await fetchUsersByRole();
      alert(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update user role');
    }
  };

  // Only admins can access this
  if (!isAdmin()) {
    return (
      <div className="alert alert-error">
        <span>You don't have permission to access the admin dashboard</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Role Filter */}
      <div className="mb-6 flex gap-4">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Filter by Role</span>
          </div>
          <select
            className="select select-bordered"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="user">Users</option>
            <option value="admin">Admins</option>
            <option value="moderator">Moderators</option>
          </select>
        </label>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Email</th>
              <th>Current Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingUsers ? (
              <tr>
                <td colSpan="4" className="text-center">
                  <span className="loading loading-spinner"></span>
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${
                      user.role === 'admin'
                        ? 'badge-error'
                        : user.role === 'moderator'
                        ? 'badge-warning'
                        : 'badge-info'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    {user.createdAt
                      ? new Date(user.createdAt.toDate?.() || user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    <div className="dropdown">
                      <button className="btn btn-sm btn-ghost">
                        Change Role ▼
                      </button>
                      <ul className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow">
                        <li>
                          <a onClick={() => handleRoleChange(user.id, 'user')}>
                            User
                          </a>
                        </li>
                        <li>
                          <a onClick={() => handleRoleChange(user.id, 'admin')}>
                            Admin
                          </a>
                        </li>
                        <li>
                          <a onClick={() => handleRoleChange(user.id, 'moderator')}>
                            Moderator
                          </a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No users found with role: {selectedRole}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Role Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-100 rounded-lg p-4">
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-info">{users.length}</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="alert mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="font-bold">How to use this admin panel:</h3>
          <ul className="text-sm mt-2">
            <li>• Select a role from the dropdown to filter users</li>
            <li>• Click "Change Role" to update a user's role</li>
            <li>• Roles available: User, Admin, Moderator</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
