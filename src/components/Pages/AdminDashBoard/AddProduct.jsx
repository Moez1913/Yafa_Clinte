import { useEffect, useState } from "react";


const AddProduct = () => {
    const [categories,setCategories]=useState([]);
    const [brands,setBrands]= useState([]) ;
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);

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

   

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'korean_dewdrop');

    try {
      console.log('Uploading to Cloudinary...');
      console.log('File name:', file.name);
      console.log('File size:', file.size);
      
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/djp63rqr8/image/upload',
        {
          method: 'POST',
          body: formData
        }
      );
      
      const data = await response.json();
      
      console.log('Cloudinary response:', data);
      
      if (!response.ok) {
        const errorMsg = data.error?.message || response.statusText;
        throw new Error(`Cloudinary error: ${errorMsg}`);
      }
      
      if (!data.secure_url) {
        throw new Error('No URL returned from Cloudinary');
      }
      
      console.log('Image uploaded successfully:', data.secure_url);
      return { url: data.secure_url, publicId: data.public_id };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      alert('Image upload failed: ' + error.message);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
        alert('Please select an image');
        return;
    }

    setUploading(true);

    try {
      // Upload image to Cloudinary first
      const imageData = await uploadImageToCloudinary(imageFile);

      if (!imageData) {
        setUploading(false);
        return;
      }

      const form = e.target;
      const productName = form.productName.value;
      const price = form.price.value;
      const discount = form.discount.value;
      const category = form.category.value;
      const brand = form.brand.value;
      const AdCategory = form.AdCategory.value;
      const forWhom = form.forWhom.value;

      const newProduct = {
        productName,
        image: imageData.url, // Cloudinary URL
        publicId: imageData.publicId, // Cloudinary public_id
        price,
        discount,
        category,
        brand,
        AdCategory,
        forWhom
      };

      const response = await fetch('http://localhost:5000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.insertedId) {
        alert('Product added successfully');
        form.reset();
        setImageFile(null);
      } else {
        throw new Error('Product not inserted');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    } finally {
      setUploading(false);
    }
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
          {/* Photo Upload */}
          <div>
            <label className="block font-medium mb-1">Upload Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="input input-bordered w-full"
              required
            />
            {imageFile && (
              <div className="mt-3">
                <p className="text-sm text-green-600 mb-2">Selected: {imageFile.name}</p>
                <img 
                  src={URL.createObjectURL(imageFile)} 
                  alt="Preview" 
                  className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
                />
              </div>
            )}
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
          <button type="submit" className="btn btn-primary mt-4" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
