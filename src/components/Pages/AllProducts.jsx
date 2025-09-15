import React from 'react';
import { useLoaderData } from 'react-router-dom';
import ProductCard from '../ProductCard';

const AllProducts = () => {
    const products= useLoaderData();
    return (
        <div className='px-32 mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-8'>All Products</h2>
            <div className='grid grid-cols-5 gap-x-0 gap-y-6 '>
             {
                products.map(product=><ProductCard key={product._id} product={product}></ProductCard>)
              }
            </div>
           
        </div>
    );
};

export default AllProducts;