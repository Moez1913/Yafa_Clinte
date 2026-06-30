import { createContext, useContext } from "react";
import { AuthContext } from "./AuthProvider";
import Swal from "sweetalert2";
import UseAxiosSecure from "../Hooks/Axios/UseAxiosSecure";


export const ShopContext = createContext(null);

const ShopProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();


  const addToCart = async (product) => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login required",
        text: "Please login to add products to cart",
      });
     
      return;
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
        text:data.message ,
      });

      } 

      if (data.insertedId || data._id || data.success) {
        Swal.fire({
          icon: "success",
          title: "Added to Cart ❤️",
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
    addToWishlist,
  };

  return (
    <ShopContext.Provider value={shopInfo}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopProvider;