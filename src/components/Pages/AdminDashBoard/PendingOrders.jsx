import { useQuery } from '@tanstack/react-query'
import React from 'react'
import UseAxiosSecure, { axiosSecure } from '../../../Hooks/Axios/UseAxiosSecure'

const PendingOrders = () => {

  const axiosSecure =UseAxiosSecure()
    const {data:Orders=[],refetch}=useQuery({
         queryKey:['orders'],
           queryFn:async ()=>{
            const res= await axiosSecure.get("/allorders")
            return res.data
           }
    })
    console.log(Orders)
  return (
    <div>{Orders.length}</div>
  )
}

export default PendingOrders