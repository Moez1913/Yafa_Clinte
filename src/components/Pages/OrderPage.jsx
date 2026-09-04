import React, { useState } from "react";
import useCart from "../../Hooks/useCart";
import useAuth from "../../Hooks/useAuth";
import UseAxiosSecure from "../../Hooks/Axios/UseAxiosSecure";
import { useEffect } from "react";
import Swal from "sweetalert2";
import UseAxios from "../../Hooks/Axios/UseAxios";
import { useNavigate } from "react-router-dom";

const OrderPage = ({ product }) => {
  const [dvCharge, setDvcharge] = useState(50);
  const [cart, refetch] = useCart();
  const { user } = useAuth();
  const axiosPublic =UseAxios();
  const axiosSecure = UseAxiosSecure();
  const [dbUser, setDbUser] = useState(null);
  const navigate = useNavigate();
  (cart);
  useEffect(() => {
    if (!user?.email) return

    axiosSecure.get(`/user?email=${user.email}&userId=${user.uid}`)
      .then((res) => {
        setDbUser(res.data);
      })
  }, [user?.email, user?.uid, axiosSecure]);
  (dbUser);

  const orderItems = product
    ? [
        {
          productName: product.productName,
          image: product.image,
          price: Number(product.price),
          quantity: 1,
          brand: product.brand,
          discount: product.discount || 0,
          productId: product._id,
        },
      ]
    : cart?.map((item) => ({
        productName: item.product.productName,
        image: item.product.image,
        price: Number(item.product.price),
        quantity: item.quantity,
        brand: item.product.brand,
        discount: item.product.discount || 0,
        productId: item.product._id,
      })) || [];

  const totalProductPrice = orderItems.reduce((sum, item) => {
    return sum + item.quantity * item.price;
  }, 0);

  const discountTotal = orderItems.reduce((sum, item) => {
    const percent = (item.price * (item.discount || 0)) / 100;
    return sum + item.quantity * percent;
  }, 0);

  const totalQuantity = orderItems.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);
  const subTotal = totalProductPrice - discountTotal;
  const total = subTotal + dvCharge;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const orderData = {
      email: user?.email || form.email?.value,
      ...(user ? { userEmail: user.email, userId: user.uid } : {}),
      name: form.name.value,
      phone: form.phone.value,
      address: form.address.value,
      note: form.note.value,
      shippingLocation: form.shippingLocation.value,
      paymentMethod: form.paymentMethod.value,
      cartIds: product ? [product._id] : cart?.map((item) => item._id),
      items: orderItems,
      totalQuantity: totalQuantity,
      totalPrice: subTotal,
      deliveryCharge: dvCharge,
      discount: discountTotal,
      total: total,
      totalProductPrice: totalProductPrice,
      status: 'pending',
      orderDate: new Date(),
    };
  if(!user){
    localStorage.setItem('public_cart', JSON.stringify([]));
  }
   axiosPublic.post("/orders", orderData).then((res) => {
  const success = res.data?.orderResult?.insertedId;

  if (success) {
    if (user) {
      refetch();
    } else {
  // Guest order history save
  const guestOrders =
    JSON.parse(localStorage.getItem("guest_orders")) || [];

  guestOrders.unshift({
    ...orderData,
    id: res.data?.orderResult?.insertedId || Date.now(),
  });

  localStorage.setItem(
    "guest_orders",
    JSON.stringify(guestOrders)
  );

  // Guest cart clear
  localStorage.removeItem("public_cart");

  // Navbar/cart update
  window.dispatchEvent(new Event("public_cart_change"));
}

    Swal.fire({
      icon: "success",
      title: "Order placed successfully",
      text: "Thank you for your order!",
      confirmButtonText: "OK",
    }).then(() => {
      form.reset();
      navigate("/");
    });

  } else {
    Swal.fire({
      icon: "error",
      title: "Order Failed",
      text: "Something went wrong.",
    });
  }
});
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mx-4 md:mx-8 lg:mx-10 mb-20">
  {/* Left Section */}
  <div className="lg:col-span-7 bg-white p-6 rounded-xl shadow">
    <h1 className="text-lg font-medium mb-6">Delivery Details</h1>

    <form
      id="orderForm"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Name & Phone */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
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

        <div className="flex-1">
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
      </div>
      {!user && (
        <div className="mt-4">
          <label className="label">
            <span className="label-text font-semibold">Email Address</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="input input-bordered w-full"
            required
          />
        </div>
      )}

      {/* Address & Note */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
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

        <div className="flex-1">
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
      </div>

      {/* Shipping & Payment */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Shipping */}
        <div className="flex-1">
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
                defaultChecked
                onChange={() => setDvcharge(50)}
              />
              <span>Inside Rajshahi (Delivery Charge: ৳50)</span>
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

        {/* Payment */}
        <div className="flex-1">
          <label className="label">
            <span className="label-text font-semibold">
              Payment Method
            </span>
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
                type="radio"
                name="paymentMethod"
                value="bKash"
                disabled
                className="radio radio-primary"
              />
              <span>bKash (Available Soon)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn btn-primary w-full text-lg mt-2"
      >
        Order Now
      </button>
    </form>
  </div>

  {/* Right Section */}
  <section className="lg:col-span-5">
    <div className="bg-base-100 shadow-lg rounded-xl p-5 lg:sticky lg:top-5">
      <h2 className="text-lg font-semibold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text mb-4">
        {product ? "Order Summary" : "Cart Summary"}
      </h2>

      {product ? (
        <div className="mb-5 rounded-3xl border border-base-300 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={product.image}
              alt={product.productName}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div>
              <h3 className="font-semibold">{product.productName}</h3>
              <p className="text-sm text-gray-500">{product.brand}</p>
              <p className="text-base font-bold mt-2">৳ {product.price}</p>
            </div>
          </div>
        </div>
      ) : null}

      <table className="table">
        <tbody>
          <tr className="bg-base-200">
            <td>Total Items</td>
            <td>:</td>
            <td>{totalQuantity}</td>
          </tr>

          <tr>
            <td>Product Price</td>
            <td>:</td>
            <td>{totalProductPrice} ৳</td>
          </tr>

          <tr className="bg-base-200">
            <td>Discount</td>
            <td>:</td>
            <td>{discountTotal} ৳</td>
          </tr>

          <tr>
            <td>Subtotal</td>
            <td>:</td>
            <td>{subTotal} ৳</td>
          </tr>

          <tr className="bg-base-200">
            <td>Delivery Charge</td>
            <td>:</td>
            <td>{dvCharge} ৳</td>
          </tr>

          <tr>
            <td className="font-bold">Total</td>
            <td>:</td>
            <td className="font-bold text-primary">
              {total} ৳
            </td>
          </tr>
        </tbody>
      </table>

      <button
        form="orderForm"
        type="submit"
        className="btn btn-primary w-full text-lg mt-6"
      >
        Order Now ({total} ৳)
      </button>
    </div>
  </section>
</div>
  );
};

export default OrderPage;
