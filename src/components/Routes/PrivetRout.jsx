import React, { useContext } from 'react'
import { AuthContext } from '../../providers/AuthProvider';
import { Link } from 'react-router-dom';

const PrivetRout = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

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
   
    

    // User is authenticated and has required role
    return children;
}

export default PrivetRout