import React from 'react'
import UseAxiosSecure from '../Axios/UseAxiosSecure'
import { useQuery } from '@tanstack/react-query'

const UseOrders = (status) => {
    const axiosSecure=UseAxiosSecure()
 const { data: orders = [], refetch } = useQuery({
    queryKey: ["orders", status],
    queryFn: async () => {
      let url = "/allorders";

      if (status) {
        url += `?status=${status}`;
      }

      const res = await axiosSecure.get(url);
      return res.data;
    },
  });

    return[orders,refetch]
}

export default UseOrders