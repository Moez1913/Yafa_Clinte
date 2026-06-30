import React, { useContext } from 'react';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { ShopContext } from '../providers/ShopProvider';
import { Link } from 'react-router-dom';

const ProductCard = ({product}) => {
  
    const{productName,image,price,discount, category,brand, AdCategory, forWhom}=product;
    const{addToWishlist,addToCart}=useContext(ShopContext)

    const stopCardNav = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    
    return (
       
    <Link to={`/product/${product._id}`}>
    <div className="w-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px] p-1.5 sm:p-2 md:p-3 bg-white rounded-none shadow-md overflow-visible relative group border-2 border-base-300 hover:border-primary transition duration-300 mx-auto">
      {/* Discount Badge */}
      {discount && discount > 0 && (
        <div className="absolute -top-3 left-3 bg-green-500 text-white text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full font-bold shadow-lg z-20 flex items-center gap-1">
          <span>💚</span>
          <span>Save {discount}%</span>
        </div>
      )}

      {/* Favorite Button */}
      <button
        type="button"
        onClick={(e) => {
          stopCardNav(e);
          addToWishlist(product);
        }}
        className="absolute top-2 right-2 z-10 bg-white p-1.5 sm:p-2 rounded-full shadow hover:bg-pink-400 transition hover:text-purple-900 "
      >
        <FaHeart size={14} className="sm:block hidden" />
        <FaHeart size={12} className="sm:hidden" />
      </button>

      {/* Product Image */}
      <div className="overflow-hidden">
        <img
          src={image}
          alt={productName}
          className="w-full h-32 sm:h-36 md:h-40 object-cover transform group-hover:scale-150 transition duration-300"
        />
      </div>

      {/* Card Content */}
      <div className="p-1.5 sm:p-2 md:p-3">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{productName}</h3>
        <p className="text-sm sm:text-base md:text-lg font-bold text-primary mt-1">
          ৳ {price}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-3">
          <button
            type="button"
            onClick={(e) => {
              stopCardNav(e);
              addToCart(product);
            }}
            className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition whitespace-nowrap"
          >
            <FaShoppingCart size={12} className="sm:block hidden" />
            <FaShoppingCart size={10} className="sm:hidden" />
            Add
          </button>
          <button
            type="button"
            onClick={stopCardNav}
            className="flex-1 bg-primary text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition hover:bg-secondary whitespace-nowrap"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
    </Link>
  );
   
};

export default ProductCard;