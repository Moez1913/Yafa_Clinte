import React from "react";

const CategoryCard = () => {
  return (
    <div className="w-40 mx-auto">
      <div className="card bg-base-100 shadow-xl transition-all duration-500 rounded-t-full hover:rounded-none overflow-hidden">
        {/* Image */}
        <figure className="overflow-hidden">
          <img
            src="/images/ampoule.png" // এখানে তোর image path দিবি
            alt="Ampoule"
            className="h-32 w-full object-contain transition-transform duration-500 hover:scale-110"
          />
        </figure>

        {/* Body */}
        <div className="card-body p-2 items-center">
          <button className="btn btn-outline w-full transition-all duration-500 hover:btn-primary hover:rounded-none">
            Ampoule
          </button>
        </div>
      </div> 
    </div>
  );
};

export default CategoryCard;
