import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase.init";
import axios from "axios";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user role from Firestore
  const fetchUserRole = async (uid, email) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const role = userDocSnap.data()?.role || "user";
        setUserRole(role);
        return role;
      } else {
        // Default role for new users
        await setDoc(userDocRef, {
          email: email,
          role: "user",
          createdAt: new Date(),
        });
        setUserRole("user");
        return "user";
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole("user");
      return "user";
    }
  };

  // 🔥 THIS IS THE MISSING PART
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser?.email) {
        // Fetch role and send JWT
        await fetchUserRole(currentUser.uid, currentUser.email);
        const userData = { email: currentUser.email };
        axios
          .post("http://localhost:5000/jwt", userData, { withCredentials: true })
          .then((res) => console.log("login", res.data))
          .catch((err) => console.error("JWT error:", err));
      } else {
        setUserRole(null);
        axios
          .post("http://localhost:5000/logout", {}, { withCredentials: true })
          .then((res) => console.log("logout", res.data))
          .catch((err) => console.error("Logout error:", err));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const creatUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

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
