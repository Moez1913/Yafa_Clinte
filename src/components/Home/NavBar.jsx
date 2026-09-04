import React, { useContext, useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { MdFavoriteBorder } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./../../providers/AuthProvider";
import UseAdmin from "../../Hooks/useAdmin/UseAdmin";

import UseAxios from "../../Hooks/Axios/UseAxios";
import Swal from "sweetalert2";

const NavBar = () => {
  const axiospublic = UseAxios();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const { user, logOut, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isAdmin] = UseAdmin();

  const handleSearch = () => {
    navigate(`/allproducts?search=${search}`);
  };

  const categoryRef = useRef(null);
  const brandRef = useRef(null);
  const location = useLocation();

  // fetching categories
  useEffect(() => {
    axiospublic.get("/categories").then((res) => {
      setCategories(res.data);
    });
  }, [axiospublic]);

  // fetching brands
  useEffect(() => {
    axiospublic.get("/brands").then((res) => {
      setBrands(res.data);
    });
  }, [axiospublic]);

  const handelLogout = () => {
    return logOut()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Logout Successful",
          text: "You have been logged out successfully.",
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Logout Failed",
          text: error.message,
        });
      });
  };
  return (
    <>
      {/* ===== Navbar Start ===== */}
      <section className="fixed top-0 left-0 w-full bg-white z-50 shadow-md">
        {/* Top Part */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-5 md:px-10 gap-3 w-full">
          {/* Logo */}
          <div className="flex gap-1 items-center">
            <h1 className="text-7xl text-purple-500 font-black">Y</h1>
            <div>
              <h1 className="text-black text-2xl font-semibold">Yafaa</h1>
              <h1 className="text-pink-400 text-base font-medium">
                Enhance Your Beauty
              </h1>
            </div>
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-auto">
            <label className="input input-bordered flex items-center gap-2 w-full">
              <input
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                className="grow"
                placeholder="Search"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="btn w-20 btn-sm btn-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </label>
          </div>

          {/* Profile */}
          {user ? (
            <>
              <div className="hidden md:flex flex-col items-center gap-1">
                <div className="dropdown dropdown-start">
                  <button tabIndex={0} role="button" className="text-4xl">
                    <CgProfile />
                  </button>

                  <ul
                    tabIndex="-1"
                    className="  dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                  >
                    <li className="border-1 border-purple-400 ">
                     
                        <Link to="/myorders">My Orders</Link>
                     
                    </li>
                   
                  
                    {isAdmin && (
                      <li>
                        <Link to="/dashboard/dashboard/pending">Dashboard</Link>
                      </li>
                    )}
                     <li>
                        <button
                      onClick={handelLogout}
                      className="btn btn-sm btn-outline"
                    >
                      LogOut
                    </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-xs">{user.displayName || user.email}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="hidden md:flex flex-col items-center gap-1">
                <div className="dropdown dropdown-start">
                  <button tabIndex={0} role="button" className="text-4xl">
                    <CgProfile />
                  </button>

                  <ul
                    tabIndex="-1"
                    className="  dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                  >
                    <li className="">
                      <Link to="/login">Sign In</Link>
                    </li>
                    <li className="">
                      <Link to="/myorders">My Orders</Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-xs">signin/signup</p>
                </div>
              </div>
            </>
          )}

          {/* Fav + Cart (hidden on mobile) */}
          <div className="hidden sm:flex gap-2">
            <NavLink to="/wishlist">
              <button className="text-xl">
                <MdFavoriteBorder />
              </button>
            </NavLink>
            <NavLink to="/cart">
              <button className="text-xl">
                <IoCartOutline />
              </button>
            </NavLink>
          </div>
        </div>

        {/* Bottom Part */}
        <div className="flex flex-wrap items-center justify-between px-5 md:px-10 py-1 bg-purple-100 border-b-2 border-black gap-2 whitespace-nowrap">
          {/* Category Dropdown */}
          <div className="flex-shrink-0 relative">
            <details className="dropdown dropdown-start" ref={categoryRef}>
              <summary className="btn btn-ghost btn-sm gap-2 normal-case inline-flex items-center justify-center text-purple-700 md:text-white md:bg-purple-800 md:hover:bg-purple-900 md:border-none md:w-auto">
                <HiOutlineMenuAlt2 />
                <span className="hidden md:inline">Categories</span>
              </summary>

              <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow max-h-60 grid grid-cols-1 overflow-y-auto">
                {categories.map((category) => (
                  <li key={category._id}>
                    <Link
                      to={`/allProducts?category=${encodeURIComponent(
                        category.categoryName,
                      )}`}
                      className="bg-purple-400 hover:bg-purple-700 text-white py-2 px-3 rounded text-center"
                      onClick={() => {
                        categoryRef.current?.removeAttribute("open");
                      }}
                    >
                      {category.categoryName}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>
          {/* Main Menu */}
          <div className="min-w-0 flex-1 md:w-auto">
            <ul className="flex flex-wrap items-center gap-4">
              <li className="text-base font-medium">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "text-purple-700 underline font-semibold"
                      : "text-gray-700 hover:text-purple-600"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li className="text-base font-semibold">
                <NavLink
                  to="/allProducts"
                  className={
                    location.pathname === "/allProducts" &&
                    location.search === ""
                      ? "text-purple-700 underline font-semibold"
                      : "text-gray-700 hover:text-purple-600"
                  }
                >
                  Product
                </NavLink>
              </li>

              {/* Brands Dropdown */}
              <details className="dropdown" ref={brandRef}>
                <summary className="text-base font-semibold cursor-pointer list-none">
                  Brands
                </summary>

                <ul className="dropdown-content p-2 shadow bg-base-100 w-52 md:w-[600px] grid grid-cols-1 md:grid-cols-3 gap-1 rounded-box max-h-60 overflow-y-auto">
                  {brands.map((brand) => (
                    <li key={brand._id}>
                      <Link
                        to={`/allProducts?brand=${encodeURIComponent(brand.brandName)}`}
                        className="block bg-purple-400 hover:bg-purple-700 text-white py-1 px-2 rounded text-center"
                        onClick={() => {
                          brandRef.current?.removeAttribute("open");
                        }}
                      >
                        {brand.brandName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
              {/* Other Menus */}

              <li className="text-base font-semibold">
                <NavLink
                  to="/allProducts?adCategory=Combo"
                  className={
                    location.pathname === "/allProducts" &&
                    location.search === "?adCategory=Combo"
                      ? "text-purple-700 underline font-semibold"
                      : "text-gray-700 hover:text-purple-600"
                  }
                >
                  Combo
                </NavLink>
              </li>
              <li className="text-base font-semibold">
                <NavLink
                  to="/allProducts?adCategory=Special%20offer"
                  className={
                    location.pathname === "/allProducts" &&
                    location.search === "?adCategory=Special%20offer"
                      ? "text-purple-700 underline font-semibold"
                      : "text-gray-700 hover:text-purple-600"
                  }
                >
                  Offers
                </NavLink>
              </li>
              <li className="hidden md:block text-base font-semibold">
                <NavLink
                  to="/allProducts?adCategory=New%20Arrival"
                  className={
                    location.pathname === "/allProducts" &&
                    location.search === "?adCategory=New%20Arrival"
                      ? "text-purple-700 underline font-semibold"
                      : "text-gray-700 hover:text-purple-600"
                  }
                >
                  New Arrivals
                </NavLink>
              </li>
              <li className="hidden md:block text-base font-semibold">
                <NavLink
                  to="/allProducts?adCategory=Popular%20Product"
                  className={
                    location.pathname === "/allProducts" &&
                    location.search === "?adCategory=Popular%20Product"
                      ? "text-purple-700 underline font-semibold"
                      : "text-gray-700 hover:text-purple-600"
                  }
                >
                  Best Seller
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Hotline */}
          <div className=" hidden lg:flex items-center gap-2">
            <TfiHeadphoneAlt className="text-2xl" />
            <div>
              <p className="text-xs">Hotline</p>
              <p className="text-base font-medium text-purple-400">
                +880 1735-797489
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ===== Navbar End ===== */}

      {/* Gap for Fixed Navbar (extra bottom padding for mobile bottom nav) */}
      <div className="pt-36 pb-20"></div>

      {/* Mobile Bottom Nav (visible only on small screens) */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t shadow-md z-50">
        <div className="flex justify-around items-center py-2">
          <NavLink
            to="/cart"
            className="flex flex-col items-center text-sm text-gray-700"
          >
            <IoCartOutline className="text-2xl" />
            <span className="text-xs">Cart</span>
          </NavLink>

          <NavLink
            to="/wishlist"
            className="flex flex-col items-center text-sm text-gray-700"
          >
            <MdFavoriteBorder className="text-2xl" />
            <span className="text-xs">Wishlist</span>
          </NavLink>

          <div className="dropdown dropdown-top">
            <button
              tabIndex={0}
              role="button"
              className="btn m-1 flex flex-col items-center text-sm text-gray-700"
            >
              {" "}
              <CgProfile className="text-2xl" />
              <span className="text-xs">{user?.displayName || "Account"}</span>
            </button>
            <ul
              tabIndex="-1"
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li>
                {user ? (
                  <a onClick={handelLogout}>Logout</a>
                ) : (
                  <Link to="/login">Login</Link>
                )}
              </li>
              <li>
                <Link to="/myorders">My Orders</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
