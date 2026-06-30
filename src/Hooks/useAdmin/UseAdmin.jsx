import React from 'react'
import UseAxiosSecure from '../Axios/UseAxiosSecure';
import useAuth from '../useAuth';
import { useQuery } from '@tanstack/react-query';

const UseAdmin = () => {
const axiosSecure = UseAxiosSecure();
    const { user } = useAuth();

    const { data: isAdmin,isPending:isAdminLoading  } = useQuery({
        queryKey: [user?.email, 'isAdmin'],
        
        queryFn: async () => {
            if (!user?.email) return false;
            const res = await axiosSecure.get(`/user/admin/${user.email}`);
            return res.data?.admin;
        }
    })

    return [isAdmin, isAdminLoading];
}

export default UseAdmin