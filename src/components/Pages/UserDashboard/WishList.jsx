import { useContext } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import useWishList from "../../../Hooks/useWishList";
import { ShopContext } from "../../../providers/ShopProvider";
import { axiosSecure } from "../../../Hooks/Axios/UseAxiosSecure";

const WishList = () => {
  const [wishList, refetch] = useWishList();
  const { addToCart } = useContext(ShopContext);

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
        axiosSecure
          .delete(`/wishlist/${id}`)
          .then((res) => {
            if (res.data?.deletedCount > 0 || res.data?.success) {
              refetch();
              Swal.fire({
                title: "Deleted!",
                text: "The item has been removed from your wishlist.",
                icon: "success",
              });
            } else {
              Swal.fire({
                title: "Not removed",
                text: "This item was not found in the wishlist.",
                icon: "info",
              });
            }
          })
          .catch(() => {
            Swal.fire({
              title: "Error",
              text: "Something went wrong while removing the item.",
              icon: "error",
            });
          });
      }
    });
  };

  const removeFromWishlist = async (id) => {
    try {
      const res = await axiosSecure.delete(`/wishlist/${id}`);
      if (res.data?.deletedCount > 0 || res.data?.success) {
        refetch();
        return true;
      }
      Swal.fire({
        title: "Not removed",
        text: "This item was not found in the wishlist.",
        icon: "info",
      });
    } catch {
      Swal.fire({
        title: "Error",
        text: "Something went wrong while removing the item.",
        icon: "error",
      });
    }
    return false;
  };

  const handleAddToCart = async (product, wishlistId) => {
    const added = await addToCart(product);
    if (added) {
      removeFromWishlist(wishlistId);
    }
  };

  



  return (
    <section className="px-10   py-6">
      <motion.h1
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-left"
      >
        <span className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text">
          WishList
        </span>
      </motion.h1>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {wishList.length !== 0 ? (
          wishList.map((item) => (
            <div key={item._id} className="card card-compact bg-base-100 shadow-lg border border-base-300 overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4">
                <div className="flex-shrink-0 rounded-lg bg-base-200 p-1">
                  <img
                    className="h-28 w-28 object-cover rounded-md"
                    src={item.product.image}
                    alt={item.product.productName}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-neutral-900 truncate">
                    {item.product.productName}
                  </h2>
                  <p className="text-sm text-neutral-600 mt-1">${item.product.price}</p>
                  <p className="text-xs text-neutral-500 mt-2 line-clamp-2">
                    {item.product.description || "No description available."}
                  </p>
                </div>
              </div>
              <div className="card-actions justify-between gap-3 p-4 pt-0 sm:flex-row flex-col">
                <button
                  type="button"
                  onClick={() => handleAddToCart(item.product, item._id)}
                  className="btn btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item._id)}
                  className="btn btn-outline w-full sm:w-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-base-300 p-8 text-center">
            <h1 className="text-2xl font-semibold">Your wishlist is empty.</h1>
            <p className="text-sm text-neutral-500 mt-2">Add favorites to your wishlist and view them here.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default WishList;
