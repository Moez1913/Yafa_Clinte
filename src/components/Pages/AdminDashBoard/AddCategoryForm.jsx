import { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/Axios/UseAxiosSecure";


const AddCategoryForm = () => {
  const [oldBrand ,setOldBrand] =useState([])
  const [brands,setBrands]= useState([oldBrand]);
  const axiosSecure = UseAxiosSecure();

  // image upload state
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(()=>{
    axiosSecure.get('https://yafaa-hop-server.vercel.app/brands')
    .then(res => {
      setOldBrand(res.data)
    })
    
  },[axiosSecure])

  

// image selection handler
const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

// upload helper copied from AddProduct
const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'yafaa_shop');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dxdh1s6lf/image/upload',
        {
          method: 'POST',
          body: formData
        }
      );
      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error?.message || response.statusText;
        throw new Error(`Cloudinary error: ${errorMsg}`);
      }
      if (!data.secure_url) {
        throw new Error('No URL returned from Cloudinary');
      }
      return { url: data.secure_url, publicId: data.public_id };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      alert('Image upload failed: ' + error.message);
      return null;
    }
  };

const handleCategory= async e =>{
    e.preventDefault();

    if (!imageFile) {
      alert('Please select an image');
      return;
    }

    setUploading(true);
    try {
      const imageData = await uploadImageToCloudinary(imageFile);
      if (!imageData) {
        setUploading(false);
        return;
      }

      const form = e.target;
      const categoryName = form.categoryName.value;

      const category = {
        categoryName,
        photoUrl: imageData.url,
        publicId: imageData.publicId
      };

      const res = await axiosSecure.post('https://yafaa-hop-server.vercel.app/categories',category)
     
      if(res.data.insertedId){
        alert('Category added successfully');
        form.reset();
        setImageFile(null);
      }
    } catch (err) {
      console.error(err);
      alert('Error adding category: ' + err.message);
    } finally {
      setUploading(false);
    }
}

// adding brand name

const handleBrand= e =>{
  
    e.preventDefault() 
    const form = e.target;
    const brandName = form.brandName.value;
   
    
    const newbrand = {
      brandName
     
    };
    (newbrand)
    
    
  axiosSecure.post('https://yafaa-hop-server.vercel.app/brands',newbrand
    )
  .then(res => {
      if(res.data.insertedId){
      alert('Brands added successfully')
    const allBrands = [...oldBrand, newbrand]
    setBrands(allBrands)
  
      form.reset()
    }
  })
 

}


  return (
    <div className=" mx-auto pt-10 bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <form onSubmit={handleCategory} className="card-body">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Category Name</span>
          </label>
          <input type="text" name="categoryName" placeholder="CategoryName" className="input input-bordered" required />
        </div>
        {uploading && (
          <p className="text-sm text-gray-500">Uploading image...</p>
        )}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Category Image</span>
          </label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input file-input-bordered"
            required
          />
        </div>
        {imageFile && (
          <div className="form-control">
            <p className="text-sm text-green-600 mb-2">Selected: {imageFile.name}</p>
            <img 
              src={URL.createObjectURL(imageFile)} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
            />
          </div>
        )}
        <div className="form-control">
          <label className="label">
          </label>
          <input  className="btn btn-primary w-full " type="submit" value="Add Category" disabled={uploading} />
        </div>
      </form>

      {/*Add Brand form */}

      <form onSubmit={handleBrand} className="card-body">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Brand Name</span>
          </label>
          <input type="text" name="brandName" placeholder="Brand Name" className="input input-bordered"/>
         
        </div>
        <div className="form-control ">
         
        <input className="btn btn-primary w-full " type="submit" value="Add Brand" />
         
        </div>
      </form>
    </div>
  );
};

export default AddCategoryForm;
