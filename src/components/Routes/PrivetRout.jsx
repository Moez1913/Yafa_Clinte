import React, { useContext } from 'react'
import { AuthContext } from '../../providers/AuthProvider';
import { Link } from 'react-router-dom';

/**
 * PrivateRoute Component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component to render if authorized
 * @param {string|string[]} props.requiredRole - Single role or array of allowed roles
 * @returns {React.ReactNode} Children if authorized, otherwise modal
 */
const PrivetRout = ({ children, requiredRole }) => {
    const { user, userRole, loading } = useContext(AuthContext);

    // If still loading, show loading state
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }

    // Check if user is authenticated
    if (!user) {
        return (
            <dialog open className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Authentication Required</h3>
                    <p className="py-4">Please log in to access this page.</p>
                    <div className="modal-action">
                        <Link to="/login" className="btn btn-primary">Go to Login</Link>
                    </div>
                </div>
            </dialog>
        )
    }

    // Check if user has required role
    if (requiredRole) {
        const hasPermission = Array.isArray(requiredRole)
            ? requiredRole.includes(userRole)
            : userRole === requiredRole;

        if (!hasPermission) {
            return (
                <dialog open className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Access Denied</h3>
                        <p className="py-4">You don't have permission to access this page. Required role: {Array.isArray(requiredRole) ? requiredRole.join(', ') : requiredRole}</p>
                        <div className="modal-action">
                            <Link to="/" className="btn btn-primary">Go Home</Link>
                        </div>
                    </div>
                </dialog>
            )
        }
    }

    // User is authenticated and has required role
    return children;
}

export default PrivetRout