import React from "react";
import cover from "../../assets/Cover.jpg";
import profile from "../../assets/Profile.png";

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row w-full h-auto md:h-[450px] mt-10 pb-4 md:pb-0">
      {/* Left Card Section */}
      <div className="md:w-1/3 w-full bg-white/80 shadow-lg rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center text-center">
        <img
          src={profile}
          alt="Profile"
          className="w-44 h-44 rounded-full border-4 border-pink-400 shadow-md mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-800">Welcome to</h2>
        <h1 className="text-3xl font-extrabold text-pink-500 mt-2">
          Korear Dewdrop
        </h1>
        <p className="text-gray-600 mt-3 text-sm">
          Discover the true essence of beauty with our premium Korean
          skincare and beauty products. Glow naturally, shine confidently.
        </p>
      </div>

      {/* Right Cover Section */}
      <div className="relative md:w-2/3 w-full h-[300px] md:h-[450px]">
        <img
          src={cover}
          alt="Cover"
          className="w-full h-full object-cover rounded-r-2xl"
        />
        {/* Overlay Text */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white p-4 rounded-r-2xl">
          <h2 className="text-4xl font-bold mb-2">Glow With Confidence</h2>
          <p className="max-w-lg text-lg">
            Handpicked Korean beauty products that enhance your natural
            beauty. Because your skin deserves the best.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
