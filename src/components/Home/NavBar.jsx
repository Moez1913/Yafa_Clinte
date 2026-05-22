import React, { useContext, useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { MdFavoriteBorder } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { NavLink } from "react-router-dom";
import { AuthContext } from "./../../providers/AuthProvider";

const NavBar = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const { user,logOut} = useContext(AuthContext);

  // fetching categories
  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  // fetching brands
  useEffect(() => {
    fetch("http://localhost:5000/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data));
  }, []);
  
   const handelLogout = () => {
    return (
      logOut()
      .then(() => {
        alert('Logout successful');
  // Sign-out successful.
      }).catch((error) => {
       alert(error.message)
      })
      )
   }
  return (
    <>
      {/* ===== Navbar Start ===== */}
      <section className="fixed top-0 left-0 w-full bg-white z-50 shadow-md">
        {/* Top Part */}
        <div className="flex justify-between items-center px-5 md:px-10 py-0">
          {/* Logo */}
          <div className="flex gap-1 items-center">
            <h1 className="text-7xl text-purple-500 font-black">K</h1>
            <div>
              <h1 className="text-black text-2xl font-semibold">Korean</h1>
              <h1 className="text-black text-2xl font-semibold">Dewdrop</h1>
            </div>
          </div>

          {/* Search Box */}
          <div>
            <label className="input input-bordered flex items-center gap-2">
              <input type="text" className="grow" placeholder="Search" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>

          {/* Profile */}
          {user ? (
            <>
              <div className="flex flex-col items-center gap-1">
                <div className="dropdown dropdown-start">
                  <button tabIndex={0} role="button" className="text-4xl">
                <CgProfile />
              </button>
                  
                  <ul
                    tabIndex="-1"
                    className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                  >
                    <button onClick={handelLogout} className="btn btn-sm btn-outline">LogOut</button>
                    <li>
                      <a>Item 2</a>
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
              <div className="flex flex-col items-center gap-1">
                <NavLink to="/login">
                  <button className="text-4xl">
                    <CgProfile />
                  </button>
                </NavLink>
                <div>
                  <p className="text-xs">Signin/Signup</p>
               
                </div>
              </div>
            </>
          )}

          {/* Admin Menu */}
          {/* <div>
            <details className="dropdown">
              <summary className="btn m-1">Customize</summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <NavLink to="/catebrand">
                  <li>Category & Brand</li>
                </NavLink>
                <NavLink to="/addproduct">
                  <li>Add Product</li>
                </NavLink>
                <div className="dropdown">
              <label tabIndex={0} className="text-base font-semibold">
                  Edit
                </label>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                  <NavLink to="/categoryBrand">
                    <li>CategoryBrand</li>
                  </NavLink>
                  <NavLink to="/products">
                    <li>Product</li>
                  </NavLink>
                </ul>
              </div>
              </ul>

              


            </details>
          </div> */}
          {user?.email === "isratjahan7974@gmail.com" && (
            <div>
              <details className="dropdown">
                <summary className="btn m-1">Customize</summary>

                <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                  <NavLink to="/catebrand">
                    <li>Category & Brand</li>
                  </NavLink>

                  <NavLink to="/addproduct">
                    <li>Add Product</li>
                  </NavLink>

                  <div className="dropdown">
                    <label tabIndex={0} className="text-base font-semibold">
                      Edit
                    </label>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                      <NavLink to="/categoryBrand">
                        <li>CategoryBrand</li>
                      </NavLink>
                      <NavLink to="/products">
                        <li>Product</li>
                      </NavLink>
                    </ul>
                  </div>
                </ul>
              </details>
            </div>
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
        <div className="flex justify-between items-center px-5 md:px-10 py-1 bg-purple-100 border-b-2 border-black">
          {/* Category Dropdown */}
          <div>
            <details className="dropdown">
              <summary className="sm:text-purple-700 md:btn md:w-40 md:m-1 md:bg-purple-800 md:text-white">
                <HiOutlineMenuAlt2 />
               <span className="hidden md:block"> Categories</span>
              </summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                {categories.map((category) => (
                  <li key={category._id}>{category.categoryName}</li>
                ))}
              </ul>
            </details>
          </div>

          {/* Main Menu */}
          <div>
            <ul className="flex gap-4">
              <NavLink to="/">
                <li className="text-base font-medium">Home</li>
              </NavLink>
              <NavLink to="/allProducts">
                <li className="text-base font-semibold">Product</li>
              </NavLink>

              {/* Brands Dropdown */}
              <div className="dropdown dropdown-hover">
                <label tabIndex={0} className="text-base font-semibold">
                  Brands
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content p-2 shadow bg-base-100 w-[600px] grid grid-cols-3 gap-1"
                >
                  {brands.map((brand) => (
                    <button
                      key={brand._id}
                      className="bg-purple-400 hover:bg-purple-700 text-white py-1 px-2 rounded"
                    >
                      {brand.brandName}
                    </button>
                  ))}
                </ul>
              </div>

              {/* Other Menus */}
              <details className="dropdown">
                <summary className="hidden md:block">SkinCare</summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                  <li>Ampula</li>
                  <li>Serum</li>
                  <li>Cream</li>
                </ul>
              </details>

              <li className="text-base font-semibold">Combo</li>
              <li className=" text-base font-semibold">Offers</li>
              <li className="hidden md:block text-base font-semibold">
                New Arrival
              </li>
              <li className="hidden md:block text-base font-semibold">
                Best Seller
              </li>
            </ul>
          </div>

          {/* Hotline */}
          <div className=" hidden lg:flex items-center gap-2">
            <TfiHeadphoneAlt className="text-2xl" />
            <div>
              <p className="text-xs">Hotline</p>
              <p className="text-base font-medium text-purple-400">
                +88017xxxxxxxx
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

          <NavLink
            to="/myorders"
            className="flex flex-col items-center text-sm text-gray-700"
          >
            <CgProfile className="text-2xl" />
            <span className="text-xs">Orders</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default NavBar;
