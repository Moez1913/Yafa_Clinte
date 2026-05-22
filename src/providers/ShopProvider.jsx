import { createContext, useContext } from "react";
import { AuthContext } from "./AuthProvider";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";



export const ShopContext = createContext(null);

const ShopProvider = ({ children }) => {
  const { user } = useContext(AuthContext);


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
      product:product
    };

    try {
      const res = await fetch(
        "http://localhost:5000/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cartData),
        }
      );

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      console.log("Server response:", data);

      if (data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Added to Cart ❤️",
          text: "Product added successfully!",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: `Failed to add product to cart: ${error.message}`,
      });
    }
  };

  const addToWishlist = async(product) => {
     if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login required",
        text: "Please login to add products to cart",
      });
     
      return;
    }

      const WhisListData = {
      userEmail: user.email,
      userId: user.uid,
      quantity: 1,
      product:product
    };
   try {
  const res = await axios.post(
    "http://localhost:5000/wishlist",
    WhisListData
  );

  console.log("Server response:", res.data);

  if (res.data.success) {
    Swal.fire({
      icon: "success",
      title: "Added to Cart ❤️",
      text: "Product added successfully!",
      timer: 1500,
      showConfirmButton: false,
    });
  }

} catch (error) {
  console.error("Axios error:", error);

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