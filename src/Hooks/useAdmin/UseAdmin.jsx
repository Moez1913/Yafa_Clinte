import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../Axios/UseAxiosSecure";
import useAuth from "../useAuth";

const UseAdmin = () => {
  const axiosSecure = UseAxiosSecure();
  const { user, loading } = useAuth();

  const {
    data: isAdmin = false,
    isPending: isAdminLoading,
  } = useQuery({
    queryKey: ["isAdmin", user?.email],

    enabled: !loading && !!user?.email,

    queryFn: async () => {
      const res = await axiosSecure.get(`/user/admin/${user.email}`);
      return res.data.admin;
    },
  });

  return [isAdmin, isAdminLoading];
};

export default UseAdmin;