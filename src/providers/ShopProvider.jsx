import { createContext, useContext } from "react";
import { AuthContext } from "./AuthProvider";
import Swal from "sweetalert2";
import UseAxiosSecure from "../Hooks/Axios/UseAxiosSecure";

const LOCAL_CART_KEY = "public_cart";

const getLocalCart = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];
  } catch (error) { 
    return [];
  }
};

const saveLocalCart = (cart) => {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
};

export const ShopContext = createContext(null);

const ShopProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();


  const addToCart = async (product) => {
    if (!user) {
      const cart = getLocalCart();
      const existingItem = cart.find((item) => item.product._id === product._id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ _id: product._id, quantity: 1, product });
      }
      saveLocalCart(cart);

      Swal.fire({
        icon: "success",
        title: "Added to cart",
        text: "Product added to local cart",
        timer: 1500,
        showConfirmButton: false,
      });

      return true;
    }

    const cartData = {
      userEmail: user.email,
      userId: user.uid,
      quantity: 1,
      product,
    };

    try {
      const { data } = await axiosSecure.post("/cart", cartData);
      if (data.alreadyExists) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: data.message,
        });
        return false;
      }

      if (data.insertedId || data._id || data.success) {
        Swal.fire({
          icon: "success",
          title: "Added to Cart ❤️",
          text: "Product added successfully!",
          timer: 1500,
          showConfirmButton: false,
        });
        return true;
      }
      return false;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: error.response?.data?.message || error.message,
      });
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) {
      const cart = getLocalCart().filter((item) => item.product._id !== productId);
      saveLocalCart(cart);
      window.dispatchEvent(new Event('public_cart_change'));
      return true;
    }

    const res = await axiosSecure.delete(`/cart/${productId}`);
    return res.data.deletedCount > 0;
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (!user) {
      const cart = getLocalCart();
      const item = cart.find((item) => item.product._id === productId);
      if (!item) return false;
      item.quantity = quantity;
      saveLocalCart(cart);
      window.dispatchEvent(new Event('public_cart_change'));
      return true;
    }

    const res = await axiosSecure.put(`/cart/${productId}`, { quantity });
    return res.data.modifiedCount > 0;
  };

  const addToWishlist = async (product) => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login required",
        text: "Please login to add products to wishlist",
      });

      return;
    }

    const wishlistData = {
      userEmail: user.email,
      userId: user.uid,
      quantity: 1,
      product,
    };

    try {
      const { data } = await axiosSecure.post("/wishlist", wishlistData);
        if (data.alreadyExists) {
        Swal.fire({
        icon: "error",
        title: "Oops!",
        text:data.message ,
      });

      } 
      if (data.success || data.insertedId || data._id) {
        Swal.fire({
          icon: "success",
          title: "Added to Wishlist ❤️",
          text: "Product added successfully!",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  const shopInfo = {
    addToCart,
    removeFromCart,
    updateCartQuantity,
    addToWishlist,
  };

  return (
    <ShopContext.Provider value={shopInfo}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopProvider;