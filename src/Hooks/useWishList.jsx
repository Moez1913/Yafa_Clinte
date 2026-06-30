import React from 'react'
import useAuth from './useAuth'


import { useQuery } from '@tanstack/react-query'
import UseAxios from './Axios/UseAxios'
import UseAxiosSecure from './Axios/UseAxiosSecure'

const useWishList = () => {
    const axios=UseAxios()
    const axiosSecure=UseAxiosSecure()
  const{user}=useAuth()
  const{data:wishList=[],refetch}=useQuery({
    queryKey:['WishList',user?.email],
    queryFn:async () => {
    const res = await axiosSecure.get(`/wishlist?email=${user.email}&userId=${user.uid}`);
    return res.data;
  },

  })
  return[wishList,refetch]
}

export default useWishList