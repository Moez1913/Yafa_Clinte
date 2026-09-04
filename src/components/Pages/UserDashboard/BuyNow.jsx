import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import UseAxios from '../../../Hooks/Axios/UseAxios'
import useAuth from '../../../Hooks/useAuth';
import OrderPage from '../OrderPage';

const BuyNow = () => {
      const axiospublic=UseAxios()
  const [product,setProduct]=useState(null)
    const {id }= useParams()
    
    useEffect(()=>{
        axiospublic.get(`/products/${id}`)
        .then(res=>{
            setProduct(res.data)
        })
    },[id,axiospublic])  
  
  
  return (
   <OrderPage product={product}></OrderPage>
  );
}

export default BuyNow