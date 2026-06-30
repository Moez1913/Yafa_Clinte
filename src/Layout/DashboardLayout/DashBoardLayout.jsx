import React from 'react'

import { NavLink, Outlet } from 'react-router-dom'
import UseAdmin from '../../Hooks/useAdmin/UseAdmin'
import AdminHome from '../../components/Pages/AdminDashBoard/AdminHome'
import { FaHome } from 'react-icons/fa'

const DashBoardLayout = () => {
    const [isAdmin]=UseAdmin()
  return (
    <div className='flex '>
        <div className="w-64 min-h-screen p-4 bg-[rgb(185,185,255)]">
         <ul className="menue">
            {
                isAdmin? <>
                <li className=" flex items-center gap-1 p-2 hover:bg-emerald-400">
                  <FaHome/> 
                <NavLink  to="dashboard/pending">AdminHome</NavLink>
                </li>
            <li className=" flex items-center gap-1 p-2 hover:bg-emerald-400">
            
                <NavLink to="dashboard/users">Users</NavLink>
                </li>
            <li className=" flex items-center gap-1 p-2 hover:bg-emerald-400">
                
                <NavLink to="dashboard/catebrand"> Add Category&Brand</NavLink>
                </li>
            <li className=" flex items-center gap-1 p-2 hover:bg-emerald-400">
               
                <NavLink to="dashboard/addproduct">Add Product</NavLink>
                </li>
            <li className=" flex items-center gap-1 p-2 hover:bg-emerald-400">
               
                <NavLink to="dashboard/category">Update Category </NavLink>
                </li>
            <li className=" flex items-center gap-1 p-2 hover:bg-emerald-400">
               
                <NavLink to="dashboard/brand">Update Brand </NavLink>
                </li>
            <li className=" flex items-center gap-1 p-2 hover:bg-emerald-400">
               
                <NavLink to="dashboard/products">Update Product</NavLink>
                </li>
        
            

                </>:<>
                <li className=" flex items-center gap-1 p-2 hover:bg-amber-700">
                
                <NavLink to="/dashboard/userhome">UserHome</NavLink>
                </li>
            <li className=" flex items-center gap-1 p-2 hover:bg-amber-700">
               
                <NavLink to="/dashboard/reservations">Reservations</NavLink>
                </li>
            <li className=" flex items-center gap-1 p-2 hover:bg-amber-700">
                
                <NavLink to="/dashboard/cart"> My Cart</NavLink>
                </li>
            <li className=" flex items-center gap-1 p-2 hover:bg-amber-700">
                
                <NavLink to="/dashboard/bookings"> My Bookings</NavLink>
                </li>
            <li className=" flex items-center gap-1 p-2 hover:bg-amber-700">
                
                <NavLink to="/dashboard/payment-history"> Payment History</NavLink>
                </li>
        
            <li className=" flex items-center gap-1 p-2 hover:bg-amber-700">
           
                <NavLink to="/dashboard/add-review"> Add Review</NavLink>
                </li>
                </>
            }
            
        
         </ul>
        </div>
        <div className="flex-1 ">
            <AdminHome></AdminHome>
            <Outlet></Outlet>
        </div>
    </div>
  )
}

export default DashBoardLayout