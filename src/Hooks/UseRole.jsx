import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';

/**
 * Custom hook to check user roles
 * @returns {Object} Object with user, role, and role checking functions
 */
const UseRole = () => {
  const { user, userRole, loading } = useContext(AuthContext);

  const isAdmin = () => userRole === 'admin';
  const isUser = () => userRole === 'user';
  const isModerator = () => userRole === 'moderator';

  const hasRole = (role) => {
    if (typeof role === 'string') {
      return userRole === role;
    }
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    return false;
  };

  return {
    user,
    userRole,
    loading,
    isAdmin,
    isUser,
    isModerator,
    hasRole,
  };
};

export default UseRole;
