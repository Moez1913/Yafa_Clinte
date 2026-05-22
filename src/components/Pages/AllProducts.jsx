import React from 'react';
import { useLoaderData } from 'react-router-dom';
import ProductCard from '../ProductCard';

const AllProducts = () => {
    const products= useLoaderData();
    return (
        <div className="px-4 sm:px-8 md:px-16 lg:px-32 mx-auto">
  
  {/* Heading */}
  <h2 className="text-3xl font-bold text-center mb-8">
    All Products
  </h2>

  {/* Product Grid */}
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
    {products.map(product => (
      <ProductCard key={product._id} product={product} />
    ))}
  </div>

</div>
    
    );
};

export default AllProducts;