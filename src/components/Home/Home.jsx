import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import NavBar from './NavBar';
import Banner from './Banner';
import FeaturesSection from './FeaturesSection';
import ProductCard from '../ProductCard';
import { Link } from 'react-router-dom';

const Home = () => {
    const[products,setProducts]=useState([]);
    const [categorys,setCategorys]=useState([]);
    const [loading, setLoading] = useState(true);

    // gradients for section titles
    const gradients = [
      'from-pink-500 via-red-500 to-yellow-500',
      'from-green-400 via-blue-500 to-purple-600',
      'from-yellow-400 via-orange-500 to-red-500',
      'from-indigo-500 via-purple-500 to-pink-500',
      'from-teal-400 via-cyan-500 to-blue-500'
    ];
    const getRandomGradient = () => gradients[Math.floor(Math.random() * gradients.length)];

    const headingVariants = {
      hidden: { x: -100, opacity: 0 },
      visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
    };

    // View All Button Component
    const ViewAllButton = ({ gradient }) => (
      <Link to="/allProducts" className={`px-2.5 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 bg-gradient-to-r ${gradient} text-white rounded-full font-semibold text-xs sm:text-sm md:text-base flex items-center gap-1 sm:gap-2 hover:shadow-lg transition-shadow duration-300 whitespace-nowrap`}>
        View All
        <FaArrowRight size={14} className="sm:block hidden" />
      </Link>
    );

   useEffect(() => {
  const apiBaseUrl = "https://yafaa-hop-server.vercel.app";

  const loadData = async () => {
    try {
      setLoading(true);

      const [productRes, categoryRes] = await Promise.all([
        fetch(`${apiBaseUrl}/products`, {
          cache: "no-store",
        }),
        fetch(`${apiBaseUrl}/categories`, {
          cache: "no-store",
        }),
      ]);

      const products = await productRes.json();
      const categories = await categoryRes.json();

      setProducts(products);
      setCategorys(categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);
const popularProducts = products.filter(product => product.AdCategory === "Popular Product");

const newArivel= products.filter(product => product.AdCategory === "New Arrival");
      
    if(loading){
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner text-primary text-4xl"></span>
            </div>
        );
    }

    return (
        <div>
       <div className='flex flex-col space-y-10'>
         <Banner></Banner>
        <FeaturesSection></FeaturesSection>
       </div>
        <div className='space-y-20'>
        <section className='px-4 sm:px-6 md:px-8 lg:px-32 mx-auto'>
            <div className='mb-4'>
                <div className='flex justify-start mb-2'>
                    <ViewAllButton gradient={getRandomGradient()} />
                </div>
                <motion.h1
                    variants={headingVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className='text-4xl font-bold text-left'
                >
                    <span className={`bg-gradient-to-r ${getRandomGradient()} text-transparent bg-clip-text`}>Popular Product</span>
                </motion.h1>
            </div>
            <div className={`h-1 w-24 mb-6 bg-gradient-to-r ${getRandomGradient()}`}></div>
            <div  className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-0 gap-y-6 '>
                {
                 popularProducts.map(product=><ProductCard key={product._id} product={product}></ProductCard>)
                }
            </div>
        </section>

        <section className='px-4 sm:px-6 md:px-8 lg:px-32 mx-auto mt-12'>
            <div className='mb-4'>
                <div className='flex justify-start mb-2'>
                    <ViewAllButton gradient={getRandomGradient()} />
                </div>
                <motion.h1
                    variants={headingVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className='text-4xl font-bold text-left'
                >
                    <span className={`bg-gradient-to-r ${getRandomGradient()} text-transparent bg-clip-text`}>New Arrival</span>
                </motion.h1>
            </div>
            <div className={`h-1 w-24 mb-6 bg-gradient-to-r ${getRandomGradient()}`}></div>
            <div  className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-0 gap-y-6 '>
                {
                 newArivel.map(product=><ProductCard key={product._id} product={product}></ProductCard>)
                }
            </div>
        </section>

        {/* dynamic sections by category */}
        {
            categorys.map(cat => {
                const productsByCat = products.filter(p => p.category === cat.categoryName);
                if(productsByCat.length === 0) return null;
                return (
                    <section key={cat._id} className='px-4 sm:px-6 md:px-8 lg:px-32 mx-auto mt-12'>
                        <div className='mb-4'>
                            <div className='flex justify-start mb-2'>
                                <ViewAllButton gradient={getRandomGradient()} />
                            </div>
                            <motion.h1
                                variants={headingVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className='text-2xl sm:text-3xl md:text-4xl font-bold text-left'
                            >
                                Shop from{' '}
                                <span className={`bg-gradient-to-r ${getRandomGradient()} text-transparent bg-clip-text`}>{cat.categoryName}</span>
                            </motion.h1>
                        </div>
                        <div className={`h-1 w-24 mb-6 bg-gradient-to-r ${getRandomGradient()}`}></div>
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-0 gap-y-6 '>
                            {productsByCat.map(product => (
                                <ProductCard key={product._id} product={product}></ProductCard>
                            ))}
                        </div>
                    </section>
                )
            })
        }
        </div>
        </div>
    );
};

export default Home;