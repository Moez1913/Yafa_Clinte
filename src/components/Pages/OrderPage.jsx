import React, { useState } from "react";
import useCart from "../../Hooks/useCart";
import useAuth from "../../Hooks/useAuth";
import UseAxiosSecure from "../../Hooks/Axios/UseAxiosSecure";
import { useEffect } from "react";
import Swal from "sweetalert2";

const OrderPage = () => {
  const [dvCharge, setDvcharge] = useState(50);
  const [cart,refetch] = useCart();
  const { user } = useAuth();
  const axiosSecure=UseAxiosSecure()
  const [dbUser,setDbUser]=useState(null)
 console.log(cart)
  useEffect(()=>{
    axiosSecure.get(`/user?email=${user?.email}&userId=${user?.uid}`)
  .then(res=>{
    setDbUser(res.data)
  })
  },[user?.email,user?.uid,axiosSecure,setDbUser])
  console.log(dbUser);
  const totalProductPrice = cart.reduce((sum, item) => {
    return sum + item.quantity * item.product.price;
  }, 0);

  const discountTotal = cart.reduce((sum, item) => {
    const percent = (item.product.price * item.product.discount) / 100;
    return sum + item.quantity * percent;
  }, 0);

  const totalQuantity = cart.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);
  const subTotal = totalProductPrice - discountTotal;
  const total = subTotal + dvCharge;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const orderData = {
  email: user.email,
  name: form.name.value,
  phone: form.phone.value,
  address: form.address.value,
  note: form.note.value,
  shippingLocation: form.shippingLocation.value,
  paymentMethod: form.paymentMethod.value,
   
  items: cart.map(item => ({
    cartIds: item._id,
    productName: item.product.productName,
    image: item.product.image,
    price: Number(item.product.price),
    quantity: item.quantity,
    brand: item.product.brand
  })),

  totalPrice:subTotal,
  deliveryCharge: dvCharge,
  status: "pending",
  orderDate: new Date()
};
console.log(orderData)
   axiosSecure.post('/orders',orderData)
   .then(res=>{
    console.log(res.data)
    if(res.data.deletedResult.deletedCount > 0){
 
      Swal.fire('deleted')
      refetch()
    }else{
      alert('something wrong')
    }
   })
  };
  return (
    <div className="grid grid-cols-12 gap-8 mx-10  justify-center ">
      <div className="grid col-span-7  bg-white p-6 rounded-xl shadow">
        <h1 className="text-lg font-medium">Delivery Details</h1>
        <form
          id="orderForm"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Left Column */}
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                defaultValue={user?.displayName}
                placeholder="Enter your full name"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Delivery Address */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Delivery Address
                </span>
              </label>
              <textarea
                name="address"
                placeholder="Enter your complete delivery address"
                className="textarea textarea-bordered w-full h-32"
                required
              ></textarea>
            </div>

            {/* Shipping Location */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Shipping Location
                </span>
              </label>

              <div className="space-y-3 mt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shippingLocation"
                    value="Inside Rajshahi - 50"
                    className="radio radio-primary"
                    onChange={() => setDvcharge(50)}
                    defaultChecked
                  />
                  <span>Inside Rajshahi(Delivery Charge:৳50)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shippingLocation"
                    value="Outside Rajshahi - 120"
                    className="radio radio-primary"
                    onChange={() => setDvcharge(120)}
                  />
                  <span>Outside Rajshahi (Delivery Charge: ৳120)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Phone */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Phone Number</span>
              </label>
              <input
                type="number"
                name="phone"
                defaultValue={dbUser?.phone}
                placeholder="01XXXXXXXXX"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Note */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Note (Optional)
                </span>
              </label>
              <textarea
                name="note"
                placeholder="Write any special instructions..."
                className="textarea textarea-bordered w-full h-32"
              ></textarea>
            </div>

            {/* Payment Method */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Payment Method</span>
              </label>

              <div className="space-y-3 mt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    className="radio radio-primary"
                    defaultChecked
                  />
                  <span>Cash on Delivery</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    disabled
                    type="radio"
                    name="paymentMethod"
                    value="bKash"
                    className="radio radio-primary"
                  />
                  <span>bKash (Available Soon)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="md:col-span-2 mt-4">
            <button type="submit" className="btn btn-primary w-full text-lg">
              Order Now
            </button>
          </div>
        </form>
      </div>
      <section className="grid col-span-5 ">
        <div className="mt-6 p-4 rounded-lg  bg-base-100 shadow-lg">
          <span className=" text-lg font-semibold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
            Cart Summary
          </span>

          <table className="table text-base font-normal">
            {/* head */}

            <tbody>
              {/* row 1 */}
              <tr className="bg-base-200 ">
                <td>Total Items</td>
                <td>:</td>
                <td>{totalQuantity} </td>
              </tr>

              <tr>
                <td>Poduct Price</td>
                <td>:</td>
                <td>{totalProductPrice} ৳</td>
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
                <td>{subTotal} ৳</td>
              </tr>
              <tr>
                <td>Delivery-Charge</td>
                <td>:</td>
                <td>{dvCharge}</td>
              </tr>
              <tr className="bg-base-200">
                <td>Total</td>
                <td>:</td>
                <td> {total}</td>
              </tr>
            </tbody>
          </table>
          <button
            form="orderForm"
            type="submit"
            className="btn btn-primary w-full text-lg mt-6"
          >
            Order Now ( {total} )
          </button>
        </div>
      </section>
    </div>
  );
};

export default OrderPage;
