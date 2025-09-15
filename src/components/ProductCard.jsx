import React from 'react';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({product}) => {
    /* productName,
      photoUrl,
      price,
      discount,
      category,
      brand,
      AdCategory,
      forWhom*/
    const{productName,photoUrl,price,discount, category,brand, AdCategory, forWhom}=product;
    
    return (
       
    <div className="w-[200px] p-2 bg-white rounded-none shadow-md overflow-hidden relative group  border-2 border-base-300 hover:border-primary transition duration-300">
      {/* Offer Badge */}
      {discount && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
          {discount}
        </span>
      )}

      {/* Favorite Button */}
      <button className="absolute top-2 right-2 z-10 bg-white p-2 rounded-full shadow hover:bg-pink-400 transition hover:text-purple-900 ">
        <FaHeart />
      </button>

      {/* Product Image */}
      <div className="overflow-hidden">
        <img
          src={photoUrl}
          alt={productName}
          className="w-full h-40 object-cover transform group-hover:scale-150 transition duration-300"
        />
      </div>

      {/* Card Content */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 truncate">{productName}</h3>
        <p className="text-lg font-bold text-primary mt-1">
          ৳ {price}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-3">
          <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium transition">
            <FaShoppingCart /> Add
          </button>
          <button className="flex-1 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium transition hover:bg-secondary">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
   
};

export default ProductCard;