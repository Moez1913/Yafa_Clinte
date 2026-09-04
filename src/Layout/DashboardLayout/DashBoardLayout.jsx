import React from "react";

import { NavLink, Outlet } from "react-router-dom";
import UseAdmin from "../../Hooks/useAdmin/UseAdmin";
import AdminHome from "../../components/Pages/AdminDashBoard/AdminHome";
import { FaHome } from "react-icons/fa";

const DashBoardLayout = () => {
  const [isAdmin] = UseAdmin();
  return (
    <div className="flex ">
      <div className="w-64 min-h-screen p-4 bg-[rgb(185,185,255)]">
        <ul className="menue">
          {isAdmin ? (
            <>
              <NavLink to="dashboard/pending">
                <li className=" flex items-center gap-1 p-2 hover:bg-emerald-400">
                  <FaHome />
                  AdminHome
                </li>
              </NavLink>

              <NavLink to="dashboard/users">
                {" "}
                <li className=" flex items-center gap-1 p-2 hover:bg-emerald-400">
                  Users
                </li>
              </NavLink>
              <NavLink to="dashboard/catebrand">  <li className=" flex items-center gap-1 p-2 hover:bg-emerald-400">Add Category & Brand</li></NavLink>
             
              
              <NavLink to="dashboard/addproduct"><li className=" flex items-center gap-1 p-2 hover:bg-emerald-400">Add Product</li></NavLink>

              
                <NavLink to="dashboard/category"><li className=" flex items-center gap-1 p-2 hover:bg-emerald-400">Update Category</li> </NavLink>
             
              
                <NavLink to="dashboard/brand"><li className=" flex items-center gap-1 p-2 hover:bg-emerald-400">Update Brand</li> </NavLink>
          
             
                <NavLink to="dashboard/products"><li className=" flex items-center gap-1 p-2 hover:bg-emerald-400">Update Product</li> </NavLink>
            
              <div className="divider"></div>

             
                <NavLink to="/"><li className=" flex items-center gap-1 p-2 hover:bg-emerald-400"><FaHome></FaHome>  Home</li> </NavLink>
            
            </>
          ) : (
            <>
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
                <NavLink to="/dashboard/payment-history">
                  {" "}
                  Payment History
                </NavLink>
              </li>

              <li className=" flex items-center gap-1 p-2 hover:bg-amber-700">
                <NavLink to="/dashboard/add-review"> Add Review</NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="flex-1 ">
        <AdminHome></AdminHome>

        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default DashBoardLayout;
