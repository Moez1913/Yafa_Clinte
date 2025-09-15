import React, { useEffect, useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { MdFavoriteBorder } from 'react-icons/md';
import { IoCartOutline } from 'react-icons/io5';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { TfiHeadphoneAlt } from 'react-icons/tfi';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // fetching categories
  useEffect(() => {
    fetch('http://localhost:5000/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  // fetching brands
  useEffect(() => {
    fetch('http://localhost:5000/brands')
      .then(res => res.json())
      .then(data => setBrands(data));
  }, []);

  return (
    <>
      {/* ===== Navbar Start ===== */}
      <section className="fixed top-0 left-0 w-full bg-white z-50 shadow-md">
        {/* Top Part */}
        <div className="flex justify-between items-center px-10 py-2">
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
          <div className="flex items-center gap-4">
            <NavLink to="/login">
              <button className="text-4xl">
                <CgProfile />
              </button>
            </NavLink>
            <div>
              <p className="text-xs">Hello, Signin/Signup</p>
              <p>My Account</p>
            </div>
          </div>

          {/* Admin Menu */}
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

          {/* Fav + Cart */}
          <div className="flex gap-2">
            <button className="text-xl">
              <MdFavoriteBorder />
            </button>
            <button className="text-xl">
              <IoCartOutline />
            </button>
          </div>
        </div>

        {/* Bottom Part */}
        <div className="flex justify-between items-center px-10 py-2 bg-purple-100 border-b-2 border-black">
          {/* Category Dropdown */}
          <div>
            <details className="dropdown">
              <summary className="btn w-40 m-1 bg-purple-800 text-white"

              >
                <HiOutlineMenuAlt2 />
                Categories
              </summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                {categories.map(category => (
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
                  {brands.map(brand => (
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
                <summary className="">SkinCare</summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                  <li>Ampula</li>
                  <li>Serum</li>
                  <li>Cream</li>
                </ul>
              </details>

              <li className="text-base font-semibold">Combo</li>
              <li className="text-base font-semibold">Offers</li>
              <li className="text-base font-semibold">New Arrival</li>
              <li className="text-base font-semibold">Best Seller</li>
            </ul>
          </div>

          {/* Hotline */}
          <div className="flex items-center gap-2">
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

      {/* Gap for Fixed Navbar */}
      <div className="pt-36"></div>
    </>
  );
};

export default NavBar;
