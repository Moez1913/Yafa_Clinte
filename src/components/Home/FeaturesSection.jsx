import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { Link } from "react-router-dom";

const FeaturesSection = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("https://yafaa-hop-server.vercel.app/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      });
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 py-8 sm:py-10 mt-4 sm:mt-8 relative z-0">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
        Feature Categories
      </h2>

      <Swiper
        slidesPerView={6}
        spaceBetween={20}
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        speed={1000}
        modules={[Autoplay]}
        breakpoints={{
          320: { slidesPerView: 3 }, // Mobile
          640: { slidesPerView: 4 }, // Small tab
          768: { slidesPerView: 5 }, // Tablet/laptop
          1024: { slidesPerView: 6 }, // Desktop
        }}
      >
        {categories.map((cat) => (
          <SwiperSlide key={cat._id}>
            <div className="w-full max-w-[160px] mx-auto">
              <div className="card h-48 bg-blue-200 shadow-xl transition-all duration-200 rounded-t-full border-2 border-solid border-purple-600 hover:rounded-none overflow-hidden">
                {/* Image */}
                <figure className="overflow-hidden">
                  <img
                    src={cat.photoUrl} // এখানে তোর image path দিবি
                    alt={cat.categoryName}
                    className="h-[120px] w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </figure>

                {/* Body */}
                <div className="card-body p-2 items-center">
                  <Link className="btn btn-outline w-full transition-all duration-200 hover:btn-primary hover:rounded-none"
                    to={`/allProducts?category=${encodeURIComponent(
                      cat.categoryName,
                    )}`}
                  >
                    
                      {cat.categoryName}
                    
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturesSection;
