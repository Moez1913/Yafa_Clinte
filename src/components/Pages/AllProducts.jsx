import React, { useEffect, useState } from 'react';
import { useSearchParams,Link } from 'react-router-dom';
import ProductCard from '../ProductCard';
import UseAxios from '../../Hooks/Axios/UseAxios';

const AllProducts = () => {
   
    const [products,setproducts]=useState([])
     const [searchParams]=useSearchParams();
     const axiospublic=UseAxios()

    const brand=searchParams.get("brand");
    const category=searchParams.get("category");
    const search=searchParams.get("search");

    useEffect(() => {
  const params = new URLSearchParams();

  if (brand) params.append("brand", brand);
  if (category) params.append("category", category);
  if (search) params.append("search", search);

  const url = `/products?${params.toString()}`;

  console.log(url);

  axiospublic.get(url).then((res) => {
    setproducts(res.data);
  });
}, [brand, category, search, axiospublic]);

 

    return <>
      {products.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-24">
    <span className="text-6xl">🔍</span>

    <h2 className="mt-4 text-3xl font-bold">
      No Products Found
    </h2>

    <p className="mt-2 text-gray-500 max-w-md text-center">
      We couldn't find any products matching your selected brand,
      category, or search keyword. Try a different filter or browse
      all products.
    </p>

    <Link
      to="/allProducts"
      className="btn btn-primary mt-6"
    >
      View All Products
    </Link>
  </div>
) : (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
    {products.map((product) => (
      <ProductCard key={product._id} product={product} />
    ))}
  </div>
)}</>
   
    
   
};

export default AllProducts;