import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../../../Hooks/Axios/UseAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

const MyOrders = () => {
  const { user } = useAuth();
  const [localOrders, setLocalOrders] = useState([]);
  const axiosSecure = UseAxiosSecure();

  const { data: orders = [], refetch } = useQuery({
    queryKey: ["orders", user?.email, user?.uid],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/myorders?email=${user.email}`);
      return res.data;
    },
  });

  useEffect(() => {
  if (!user) {
    const savedOrders =
      JSON.parse(localStorage.getItem("guest_orders")) || [];

    setLocalOrders(savedOrders);
  }
}, [user]);

  (orders);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <section className="bg-base-100 shadow-lg rounded-xl p-6 border">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={user?.photo || "https://i.ibb.co/2kR5zqM/user.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-primary object-cover"
          />
          <div className="space-y-2">
            <h3 className="text-xl font-bold">{user?.displayName || "User Name"}</h3>
            <p className="text-gray-500">{user?.email}</p>
            <span className="badge badge-success">Active Account</span>
          </div>
        </div>
      </section>

      <section className="bg-base-100 shadow-lg rounded-xl p-6 border">
        <h2 className="text-2xl font-bold mb-6">Order History</h2>

        {(user ? orders : localOrders).length > 0 ? (
          <div className="space-y-5">
            {(user ? orders : localOrders).map((order) => (
              <div
                key={order._id}
                className="border rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-lg">Order ID: {order._id}</h3>
                  <p className="text-gray-500">Date: {order.orderDate || order.date}</p>
                </div>
                <div>
                  <p className="font-semibold">Total: ? {order.total}</p>
                </div>
                <div>
                  <span
                    className={`badge ${
                      order.status === "pending"
                        ? "badge-warning"
                        : order.status === "Delivered" || order.status === "delivered"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <button className="btn btn-primary btn-sm">View Details</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No Orders Found.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default MyOrders;
