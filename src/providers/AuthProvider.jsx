import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.init";
import UseAxios from "../Hooks/Axios/UseAxios";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const axios = UseAxios();

  useEffect(() => {
   const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    try {
      setLoading(true);
      setUser(currentUser);

      if (currentUser) {
        const userInfo = {
          email: currentUser.email,
        };

        const res = await axios.post("/jwt", userInfo);

        if (res.data?.token) {
          localStorage.setItem("access-token", res.data.token);
        } else {
          localStorage.removeItem("access-token");
        }
      } else {
        localStorage.removeItem("access-token");
      }
    } catch (error) {
      console.error("JWT Error:", error);
      localStorage.removeItem("access-token");
    } finally {
      setLoading(false);
    }
  });
  
  return () => unsubscribe();
}, [axios]);

  const creatUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  useEffect(() => {
  console.log("Current User:", user);
}, [user]);

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(true);
    setUserRole(null);
    return signOut(auth);
  };

  const userInfo = {
    user,
    loading,
    userRole,
    creatUser,
    signInUser,
    logOut,
  };

  return (
    <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
