
import { motion } from "framer-motion";
import { AuthContext } from "../../../providers/AuthProvider";
import { RiDeleteBin2Line } from "react-icons/ri";
import Swal from "sweetalert2";

import { Link } from "react-router-dom";

import useCart from "../../../Hooks/useCart";
import UseAxiosSecure from "../../../Hooks/Axios/UseAxiosSecure";

export const Cart = () => {
  const axiosSecure = UseAxiosSecure();
  const [cart, refetch] = useCart();
  console.log(cart)

  const headingVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  const handleDelet = (id) => {
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
        axiosSecure.delete(`/cart/${id}`).then((res) => {
          if (res.data?.deletedCount > 0) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "The item has been removed from your cart.",
              icon: "success",
            });
          } else {
            Swal.fire({
              title: "Not removed",
              text: "This item was not found in the cart.",
              icon: "info",
            });
          }
        });
      }
    });
  };

  const handleQuantity = (item, type) => {
    let newQty = item.quantity;

    if (type === "minus") {
      if (item.quantity === 1) {
        /* ... */ return;
      }
      newQty = item.quantity - 1;
    }
    if (type === "plus") {
      if (item.quantity === 5) {
        /* ... */ return;
      }
      newQty = item.quantity + 1;
    }

    axiosSecure.put(`/cart/${item._id}`, { quantity: newQty }).then((res) => {
      refetch();
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: `Quantity updated to ${newQty}`,
          timer: 600,
          showConfirmButton: false,
        });
      }
    });
  };

  const total = cart.reduce((sum, item) => {
    return sum + item.quantity * item.product.price;
  }, 0);

  const discountTotal = cart.reduce((sum, item) => {
    const percent = (item.product.price * item.product.discount) / 100;
    return sum + item.quantity * percent;
  }, 0);

  const totalQuantity = cart.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);
  return (
    
      <div className="grid grid-cols-12 ml-10  ">
      <section className="grid col-span-8 mr-10">

        <div className="overflow-x-auto">
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
              {cart.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img
                      src={item.product.image}
                      alt={item.product.productName}
                      className="h-16 w-16 object-cover rounded"
                    />
                  </td>

                  <td className="font-semibold">{item.product.productName}</td>

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

                  <td>৳ {Number(item.product.price) * item.quantity}</td>

                  <td>
                    <button
                      onClick={() => handleDelet(item._id)}
                      className="btn btn-sm btn-error text-white"
                    >
                      <RiDeleteBin2Line /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TOTAL */}
          <div className="text-right mt-6 text-xl font-bold">
            Total Price:{total} ৳
          </div>
        </div>
      </section>

      {/*<<<<< Order summary >>>*/}

      <section className="grid col-span-4 ">
     
          

          <div className="mt-6 p-6 rounded-lg  bg-base-100 shadow-lg">
             <motion.h2
              variants={headingVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl font-bold text-left mb-2"
            >
              <span className="bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
              Cart Summary
              </span>
            </motion.h2>
              <table className="table text-base font-normal">
              {/* head */}
              
              <tbody>
                {/* row 1 */}
                <tr className="bg-base-200 ">
                
                  <td>Total Items :</td>
                  <td>:</td>
                  <td>{totalQuantity} ৳</td>
                  
                </tr>
                {/* row 2 */}
                <tr>
                  
                  <td>Poduct Price</td>
                  <td>:</td>
                  <td>{total} ৳</td>
                  
                </tr>
                {/* row 3 */}
                <tr className="bg-base-200">
                  
                  <td>Disucount</td>
                  <td>:</td>
                  <td>{discountTotal} ৳</td>
                  
                </tr>
                <tr>
                  
                  <td>Subtotal</td>
                  <td>:</td>
                  <td>{total-discountTotal} ৳</td>
                  
                </tr>
                <tr>
                  
                  <td>Delivery-Charge</td>
                  <td>:</td>
                  <td>
                    inside Rajshahi:50 ৳ <br />
                    outside Rajshahi: 120 ৳
                  </td>
                  
                </tr>
                 <tr className="bg-base-200">
                  
                  <td>Total</td>
                  <td>:</td>
                  <td>{total-discountTotal} ৳ + Delivery-charge</td>
                  
                </tr>
              </tbody>
            </table>
         
          <Link to="/OrderPage">
            <button className="btn btn-primary mt-4">
              Proceed to Checkout
            </button>
          </Link>
        </div>
          
      
      </section>
    </div>

  );
};
