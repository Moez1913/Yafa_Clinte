import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import Banner from './Banner';
import FeaturesSection from './FeaturesSection';
import ProductCard from '../ProductCard';

const Home = () => {
    const[products,setProducts]=useState([]);

    useEffect(()=>{
        fetch('http://localhost:5000/products')
        .then(res => res.json())
        .then(data => {
            setProducts(data);
        })
      },[])
const popularProducts = products.filter(product => product.AdCategory === "Popular Product");

const newArivel= products.filter(product => product.AdCategory === "New Arrival");
      
    return (
        <div>
        <Banner></Banner>
        <FeaturesSection></FeaturesSection>
        <section className='px-32 mx-auto'>
            <h1 className='text-4xl text-black font-bold text-center'>Popular Product</h1>
            <div  className='grid grid-cols-5 gap-x-0 gap-y-6 '>
                {
                 popularProducts.map(product=><ProductCard key={product._id} product={product}></ProductCard>)
                }
            </div>
        </section>

        <section className='px-32 mx-auto'>
            <h1 className='text-4xl text-black font-bold text-center'>New Arrival</h1>
            <div  className='grid grid-cols-5 gap-x-0 gap-y-6 '>
                {
                 newArivel.map(product=><ProductCard key={product._id} product={product}></ProductCard>)
                }
            </div>
        </section>
        </div>
    );
};

export default Home;