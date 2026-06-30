

import Swal from "sweetalert2";
import { AuthContext } from "../../../providers/AuthProvider";
import { motion } from "framer-motion";
import { RiDeleteBin2Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import useWishList from "../../../Hooks/useWishList";
import UseAxios from "../../../Hooks/Axios/UseAxios";
import { axiosSecure } from "../../../Hooks/Axios/UseAxiosSecure";


const WishList = () => {

  const [wishList,refetch]=useWishList()




   const handleDelet=(id)=>{
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          axiosSecure.delete(`/wishlist/${id}`)
            .then((res) => {
              if (res.data?.deletedCount > 0 || res.data?.success) {
                refetch();
                Swal.fire({
                  title: "Deleted!",
                  text: "The item has been removed from your wishlist.",
                  icon: "success"
                });
              } else {
                Swal.fire({
                  title: "Not removed",
                  text: "This item was not found in the wishlist.",
                  icon: "info"
                });
              }
            })
            .catch(() => {
              Swal.fire({
                title: "Error",
                text: "Something went wrong while removing the item.",
                icon: "error"
              });
            });
        }
      });
    }

    const handleQuantity=(item,type)=>{ 
       let newQty=item.quantity
   
        if (type === "minus") {
         if (item.quantity === 1) { /* ... */ return; }
         newQty = item.quantity - 1;
       }
       if (type === "plus") {
         if (item.quantity === 5) { /* ... */ return; }
         newQty = item.quantity + 1;
       }
       
       axiosSecure.put(`/wishlist/${item._id}`, { quantity: newQty })
       .then(res=>{
         refetch()
        if(res.data.modifiedCount>0){
         Swal.fire({
           icon: "success",
           title: "Updated!",
           text: `Quantity updated to ${newQty}`,
           timer: 600,
           showConfirmButton: false,
         });
        }
       })
     }
   
     const total=wishList.reduce((sum,item)=>{
       return sum+(item.quantity*item.product.price)
     },0)
  
  
    return (
      <div className="grid grid-cols-6 gap-6">
         <section className="grid col-span-4">
        <motion.h1
          
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-4xl font-bold text-left"
        >
          <span className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text">
            WishList
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
              {wishList.map((item) => (
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
                        onClick={()=>handleQuantity(item,"minus")}
                        className="h-8 w-8 bg-slate-400 text-xl"
                      >
                        -
                      </button>
  
                      <span className="text-lg font-semibold">
                        {item.quantity}
                      </span>
  
                      <button
                         onClick={()=>handleQuantity(item,"plus")}
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
                    <button onClick={() => handleDelet(item._id)} className="btn btn-sm btn-error text-white">
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
  
      <section className="grid col-span-2">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl font-bold text-left mt-4"
        >
          <span className="bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
            Order Summary
          </span>
        </motion.h2>
        <div className="mt-2 p-6 bg-gray-100 rounded-lg">
          <p className="text-lg">
            <span className="font-semibold">Total Items:</span> {wishList.length}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Total Price:{total}</span> ৳ 
          </p>
          <Link to="/OrderPage">
            <button className="btn btn-primary mt-4">Proceed to Checkout</button>
          </Link>
        </div>
      </section>
      </div>
     
    );
}

export default WishList