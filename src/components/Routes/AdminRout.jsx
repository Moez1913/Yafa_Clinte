// import React from 'react'
// const AdminRout = ({ children }) => {
//     const {user,loading}=useAuth()
//     const[isAdmin,isAdminLoading]=UseAdmin();
//     const location = useLocation();

import { useLocation } from "react-router-dom"
import UseAdmin from "../../Hooks/useAdmin/UseAdmin"
import useAuth from "../../Hooks/useAuth"

    
//         if(loading || isAdminLoading){
//             return <div>Loading...</div>
//         }
//         if(user&& isAdmin){
//             return children;
//         }return <Navigate to="/login" state={{ from: location }} replace />;
        
  
// }
const AdminRout = ({children}) => {
    const {user,loading}=useAuth()
    const [isAdmin, isAdminLoading]=UseAdmin()
    const location=useLocation()
 if(loading || isAdminLoading){
    return <div>Loading...</div>
 }
 if(user&&isAdmin){
    return children;
 }return <Navigate to="/login" state={{ from: location }} replace />;
}

export default AdminRout