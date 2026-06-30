import React from 'react'

import useAuth from './useAuth'
import { useQuery } from '@tanstack/react-query'
import UseAxios from './Axios/UseAxios'
import UseAxiosSecure from './Axios/UseAxiosSecure'

const useCart = () => {
  const axiosSecure=UseAxiosSecure()
  const{user}=useAuth()
  const{data:cart=[],refetch}=useQuery({
    queryKey:['cart',user?.email],
    queryFn:async () => {
    const res = await axiosSecure.get(`/cart?email=${user.email}&userId=${user.uid}`,{
      headers:{
        authorization:`Bearer ${localStorage.getItem('access-token')}`
      }
    });
    return res.data;
  },

  })
  return[cart,refetch]
}

export default useCart