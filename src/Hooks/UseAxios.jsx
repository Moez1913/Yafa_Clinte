import axios from 'axios'
import React, { use, useContext, useEffect } from 'react'
import { AuthContext } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';




const axiosInstance=axios.create({
    baseURL:'http://localhost:5000',
    withCredentials:true,
})

const UseAxios = () => {
  const { logOut } = useContext(AuthContext);
  const navigate=useNavigate();
  useEffect(()=>{
    axiosInstance.interceptors.response.use(response=>{
        return response
    },
  error=>{
    if(error.status===401 || error.status===403){
      console.log('Unauthorized or Forbidden - Logging out user');
     logOut()
     .then(()=>{
      console.log('User logged out successfully');
      navigate('/login'); 

     })
    }
    return Promise.reject(error)
  })
  },[logOut,navigate])
  
  return axiosInstance 
}

export default UseAxios