import { useEffect, useState } from "react";


const AddProduct = () => {
    const [categories,setCategories]=useState([]);
    const [brands,setBrands]= useState([]) ;

    useEffect(()=>{
      fetch('http://localhost:5000/categories')
      .then(res => res.json())
      .then(data => {
          setCategories(data);
      })
    },[])

    useEffect(()=>{
      fetch('http://localhost:5000/brands')
      .then(res => res.json())
      .then(data => {
          setBrands(data);
      })
    },[])

   

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const productName = form.productName.value;
    const photoUrl= form.PhotoUrl.value;
    const price = form.price.value;
    const discount = form.discount.value;
    const category = form.category.value;
    const brand = form.brand.value;
    const AdCategory = form.AdCategory.value;
    const forWhom = form.forWhom.value;

    const newProduct = {
      productName,
      photoUrl,
      price,
      discount,
      category,
      brand,
      AdCategory,
      forWhom
    };

    fetch('http://localhost:5000/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduct)
    })
      .then(res => res.json())
      .then(data => {
        if (data.insertedId) {
          alert('Product added successfully');
          form.reset();
        }
      });
  };

 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">
          ➕ Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {/* Product Name */}
          <div>
            <label className="block font-medium mb-1">Product Name</label>
            <input
              type="text"
              name="productName"
              
              className="input input-bordered w-full"
              placeholder="Enter product name"
              required
            />
          </div>
          {/* Photo Url */}
          <div>
            <label className="block font-medium mb-1">Photo Url</label>
            <input
              type="url"
              name="PhotoUrl"
              
              className="input input-bordered w-full"
              placeholder="PhotoUrl"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              
              className="input input-bordered w-full"
              placeholder="Enter price"
              required
            />
          </div>

          {/* Discount */}
          <div>
            <label className="block font-medium mb-1">Discount (%)</label>
            <input
              type="number"
              name="discount"
              className="input input-bordered w-full"
              placeholder="Enter discount"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium mb-1">Category</label>
            <select
              name="category"
             
              className="select select-bordered w-full"
              required
            >
              <option value="">-- Select Category --</option>
              
               {
                categories.map(category => (
                  <option key={category._id} value={category.categoryName}>
                    {category.categoryName}
                  </option>
                ))
               }
              
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className="block font-medium mb-1">Brand</label>
            <select
              name="brand"
          
              className="select select-bordered w-full"
              required
            >
              <option value="">-- Select Brand --</option>
             
                {
                  brands.map(brand => (
                    <option key={brand._id} value={brand.brandName}>
                      {brand.brandName}
                    </option>
                  ))
                }
            
            </select>
          </div>

          {/* Additional Category */}
         <div>
            <label className="block font-medium mb-1">Additional Category</label>
            <select
              name="AdCategory"
              className="select select-bordered w-full"
              required   
            >
              <option value="">-- Select Category --</option>
        
                <option>
                  Popular Product
                </option>
                <option>
                  New Arrival
                </option>
                
                <option>
                  Combo
                </option>
                <option>
                  Special offer
                </option>
                
         
            </select>
          </div>

          {/* For (Men/Women/Kids/Unisex) */}
          <div>
            <label className="block font-medium mb-1">For</label>
            <select
              name="forWhom"
             
              className="select select-bordered w-full"
              required
            >
              <option value="">-- Select --</option>
          
                <option>
                 Oily
                </option>
                <option>
                 Dray
                </option>
                <option>
                 Combination
                </option>
                <option>
                 Combination To Dry
                </option>
                <option>
                 Combination To Oily
                </option>
        
            </select>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary mt-4">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
