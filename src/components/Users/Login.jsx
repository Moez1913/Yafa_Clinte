
import { Link, useNavigate } from 'react-router-dom';
import bg from '../../assets/yafaaLogo.png'

import React, { useContext, useState } from "react";
import { AuthContext } from '../../providers/AuthProvider';
import Swal from 'sweetalert2';
import axios from 'axios';

const Login = () => {
  const [showPwd, setShowPwd] = useState(false);
  const{signInUser} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
  e.preventDefault();

  const form = e.target;
  const email = form.email.value;
  const password = form.password.value;

  signInUser(email, password)
    .then((result) => {
      const userEmail = result.user?.email || "user";

      Swal.fire({
        icon: "success",
        title: "SignIn Successful",
        text: `Welcome, ${userEmail}!`,
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        navigate("/");
      });

      form.reset();
    })
    .catch((err) => {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.message,
      });
    });
};

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const form = e.target;
  //   const email = form.email.value;
  //   const  password =form.password.value;
  //   const remember = form.remember.value;
    
  //   signInUser(email,password)
  //   .then(result =>{
  //     const user = result.user;
  //       Swal.fire({
  //                   icon: 'success',
  //                   title: 'SignIn Successful',
  //                   text: `Welcome, ${user.email}!`,
  //                   showConfirmButton: false,
  //                   timer: 2000
  //                 })
      
  //   })
  //   .catch(err => console.error(err))
  //   form.reset();
  //    Navigate('/')
  // };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative"
      style={{
        backgroundImage:
          ` url(${bg})`,
      }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg shadow-2xl p-6 md:p-8 text-white"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
            Welcome Back
          </h1>

          {/* email */}
          <label className="label">
            <span className="label-text text-white/90">Email</span>
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="input input-bordered w-full bg-white/10 border-white/30 placeholder-white/70 focus:bg-white/15"
          />

          {/* password */}
          <label className="label mt-3">
            <span className="label-text text-white/90">Password</span>
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPwd ? "text" : "password"}
              required
              placeholder="••••••••"
              className="input input-bordered w-full bg-white/10 border-white/30 placeholder-white/70 pr-12 focus:bg-white/15"
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="btn btn-ghost btn-xs absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>

          {/* options */}
          <div className="mt-3 flex items-center justify-between">
            <label className="label cursor-pointer gap-2">
              <input type="checkbox" name="remember" className="checkbox checkbox-sm" />
              <span className="label-text text-white/90">Remember me</span>
            </label>
            <a href="#" className="link link-hover text-white/90">
              Forgot password?
            </a>
          </div>

          {/* submit */}
          <button
            type="submit"
            className="btn btn-primary w-full mt-5 rounded-xl hover:scale-[1.01] transition"
          >
            Log In
          </button>

          {/* divider */}
          <div className="divider divider-neutral my-6 before:bg-white/30 after:bg-white/30 text-white/80">
            or
          </div>

          {/* alt actions */}
          <div className="flex gap-3">
            <button type="button" className="btn btn-outline flex-1 border-white/40 text-white hover:bg-white/20">
              Continue with Google
            </button>
            
              <Link to='/signup' className="btn btn-secondary flex-1 rounded-xl ">Create Account</Link>
            
          </div>
        </form>
      </div>
    </div>
  );
};




export default Login;