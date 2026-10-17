import React, { useEffect, useState } from 'react'
import { RiDeleteBin2Line } from 'react-icons/ri';

import UseAxios from '../../../Hooks/Axios/UseAxios';
import UseAxiosSecure from '../../../Hooks/Axios/UseAxiosSecure';


const Brand = () => {
  const axiosPublic=UseAxios()
  const axiosSecure=UseAxiosSecure()
 
    const [brandList, setBrandList] = useState([]);

      useEffect(()=>{
         axiosPublic.get('/brands')
         .then(res=>{
          setBrandList(res.data)
         })
      },[axiosPublic])
      
    const deletBrand = (_id)=>{
    axiosSecure.delete(`/brands/${_id}`)
    
      .then(res => {
       
        if (res.data.deletedCount > 0) {
          const remaining = brandList.filter(
            (brand) => brand._id !== _id
          );
          setBrandList(remaining);

          alert("Deleted Successfully");

          // const remaining = categorys.filter(category => category._id !== _id)
          // setCategorys(remaining)
        }
      });
  };

  return (
    <section>
        <h2 className="text-3xl font-bold text-center mb-8">All Brands</h2>
        <div className="grid grid-cols-2 gap-2">
          {brandList.map((brand) => (
            <div class=" flex gap-5 bg-base-200 px-5">
              <div class="collapse-title text-xl font-medium">
                {brand.brandName}
              </div>
              <button onClick={() => deletBrand(brand._id)} className="text-red-500">
                <RiDeleteBin2Line />
              </button>
              
              
            </div>
          ))}
        </div>
      </section>
  )
}

export default Brand