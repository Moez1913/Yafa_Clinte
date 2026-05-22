import React from 'react'
import { useLoaderData } from 'react-router-dom'

const ProductDetails = () => {
    const product = useLoaderData();
  return (
    <div>{product.productName}</div>
  )
}


export default ProductDetails