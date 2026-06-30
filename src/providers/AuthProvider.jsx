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
import UseAxios from "../Hooks/Axios/UseAxios";


export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const axios=UseAxios()


 

  // 🔥 THIS IS THE MISSING PART
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if(currentUser){  
        const userInfo={email:currentUser?.email}
        axios.post('/jwt',userInfo)
        .then(res=>{
            console.log('JWT Response:', res.data);
          if(res.data?.token){
            localStorage.setItem('access-token', res.data.token)
          }
        })

      }else{
        localStorage.removeItem('access-token')
      }
     
      setLoading(false);
    });

    return () => unsubscribe();
  }, [axios]);

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
