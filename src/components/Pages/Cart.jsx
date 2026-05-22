import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../providers/AuthProvider";
import { RiDeleteBin2Line } from "react-icons/ri";
import Swal from "sweetalert2";
import axios from "axios";
import { Link } from "react-router-dom";
import UseAxios from "../../Hooks/UseAxios";

export const Cart = () => {
  const { user, loading } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const headingVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x:0 ,opacity: 1, transition: { duration: 0.6 } },
  };
  
const axiosInstance=UseAxios();
  // 🔹 Load cart data
  useEffect(() => {
    if (loading) return;

    if (!user?.email || !user?.uid) {
      setCartItems([]);
      setCartLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await axiosInstance.get(`/cart?email=${user.email}&userId=${user.uid}`, { withCredentials: true });
        const data = res.data;

        // ensure quantity
        const withQty = data.map((item) => ({
          ...item,
          quantity: item.quantity || 1,
        }));

        setCartItems(withQty);
      } catch (error) {
        console.error("Cart fetch error:", error);
      } finally {
        setCartLoading(false);
      }
    };

    fetchCart();
  }, [user, loading]);

  // 🔹 Calculate total price (⚠️ MUST be before return)
  useEffect(() => {
    const sum = cartItems.reduce((acc, item) => {
      return acc + Number(item.product.price) * item.quantity;
    }, 0);

    setTotal(sum);
  }, [cartItems]);

  // 🔹 Quantity handler
//   const handleQuantity = async (item, type) => {
//   let newQty = item.quantity;

//   // ➖ Minus
//   if (type === "minus") {
//     if (item.quantity === 1) {
//       Swal.fire({
//         icon: "warning",
//         title: "Minimum reached",
//         text: "Quantity cannot be less than 1",
//       });
//       return;
//     }
//     newQty = item.quantity - 1;
//   }

//   // ➕ Plus
//   if (type === "plus") {
//     if (item.quantity === 5) {
//       Swal.fire({
//         icon: "warning",
//         title: "Limit reached",
//         text: "Maximum 5 items allowed",
//       });
//       return;
//     }
//     newQty = item.quantity + 1;
//   }

//   // 🔹 1️⃣ UI instant update
//   setCartItems((prev) =>
//     prev.map((i) =>
//       i._id === item._id ? { ...i, quantity: newQty } : i
//     )
//   );

//   // 🔹 2️⃣ DB update + SweetAlert
//   try {
//     const res = await fetch(
//       `http://localhost:5000/cart/${item._id}`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ quantity: newQty }),
//       }
//     );

//     if (!res.ok) {
//       throw new Error("Failed to update quantity");
//     }

//     // ✅ SUCCESS SweetAlert
//     Swal.fire({
//       icon: "success",
//       title: "Updated!",
//       text: `Quantity updated to ${newQty}`,
//       timer: 900,
//       showConfirmButton: false,
//     });
//   } catch (error) {
//     console.error(error);

//     // ❌ ERROR SweetAlert
//     Swal.fire({
//       icon: "error",
//       title: "Oops!",
//       text: "Failed to update quantity",
//     });
//   }
// };
const handleQuantity = async (item, type) => {
  let newQty = item.quantity;

  if (type === "minus") {
    if (item.quantity === 1) {
      Swal.fire({
        icon: "warning",
        title: "Minimum reached",
        text: "Quantity cannot be less than 1",
      });
      return;
    }
    newQty = item.quantity - 1;
  }
  if (type === "plus") {
    if (item.quantity === 5) {
      Swal.fire({
        icon: "warning",
        title: "Limit reached",
        text: "Maximum 5 items allowed",
      });
      return;
    }
    newQty = item.quantity + 1;
  }

  // ✅ ADD THIS - check what _id actually looks like
  console.log("Item ID:", item._id);
  console.log("New Qty:", newQty);

  setCartItems((prev) =>
    prev.map((i) => (i._id === item._id ? { ...i, quantity: newQty } : i))
  );

  try {
    const res = await fetch(`http://localhost:5000/cart/${item._id}`,{
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQty }),
    });

    // ✅ ADD THIS - check the response
    const data = await res.json();
    console.log("Server response:", data);

    if (!res.ok) throw new Error("Failed to update quantity");

    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: `Quantity updated to ${newQty}`,
      timer: 900,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error(error);
    Swal.fire({ icon: "error", title: "Oops!", text: "Failed to update quantity" });
  }
};

  // 🔹 UI states (AFTER hooks)
  if (cartLoading) return <p>Loading cart...</p>;
  if (cartItems.length === 0) return <p>No items in cart</p>;

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/cart/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then(() => {
            setCartItems((prev) => prev.filter((item) => item._id !== id));
            // Swal.fire("Deleted!", "Your item has been deleted.", "success");
          })
          .catch((error) => {
            console.error(error);
            Swal.fire("Error!", "Failed to delete item.", "error");
          });
      }
    });
  };
 
  return (
    <div className="grid grid-cols-6 gap-6">
       <section className="grid col-span-4">
      <motion.h1
        variants={headingVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-4xl font-bold text-left"
      >
        <span className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text">
          Cart
        </span>
      </motion.h1>

      <div className="overflow-x-auto mt-6">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-purple-500 text-white">
              <th>Image</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {cartItems.map((item) => (
              <tr key={item._id}>
                <td>
                  <img
                    src={item.product.image}
                    alt={item.product.productName}
                    className="h-16 w-16 object-cover rounded"
                  />
                </td>

                <td className="font-semibold">
                  {item.product.productName}
                </td>

                <td>৳ {item.product.price}</td>

                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantity(item, "minus")}
                      className="h-8 w-8 bg-slate-400 text-xl"
                    >
                      -
                    </button>

                    <span className="text-lg font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => handleQuantity(item, "plus")}
                      className="h-8 w-8 bg-slate-400 text-xl"
                    >
                      +
                    </button>
                  </div>
                </td>

                <td>
                  ৳ {Number(item.product.price) * item.quantity}
                </td>

                <td>
                  <button onClick={()=>handleDelete(item._id)} className="btn btn-sm btn-error text-white">
                    <RiDeleteBin2Line /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTAL */}
        <div className="text-right mt-6 text-xl font-bold">
          Total Price: ৳ {total}
        </div>
      </div>
    </section>


    {/*<<<<< Order summary >>>*/}

    <section className="grid col-span-2">
      <motion.h2
        variants={headingVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-3xl font-bold text-left mt-12"
      >
        <span className="bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
          Order Summary
        </span>
      </motion.h2>
      <div className="mt-6 p-6 bg-gray-100 rounded-lg">
        <p className="text-lg">
          <span className="font-semibold">Total Items:</span> {cartItems.length}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Total Price:</span> ৳ {total}
        </p>
        <Link to="/OrderPage">
          <button className="btn btn-primary mt-4">Proceed to Checkout</button>
        </Link>
      </div>
    </section>
    </div>
   
  );
};