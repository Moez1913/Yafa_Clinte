import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UseAxios from "../../../Hooks/Axios/UseAxios";
import UseAxiosSecure from "../../../Hooks/Axios/UseAxiosSecure";

const AddProduct = () => {
  const axiosPublic = UseAxios();
  const axiosSecure = UseAxiosSecure();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          axiosPublic.get("/categories"),
          axiosPublic.get("/brands"),
        ]);

        setCategories(categoriesRes.data || []);
        setBrands(brandsRes.data || []);
      } catch (error) {
        console.error("Failed to load product options:", error);
        Swal.fire({
          icon: "error",
          title: "Unable to load form options",
          text: error.message,
        });
      }
    };

    loadOptions();
  }, [axiosPublic]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "yafaa_shop");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dxdh1s6lf/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Image upload failed");
    }

    if (!data.secure_url) {
      throw new Error("No image URL returned from Cloudinary");
    }

    return { url: data.secure_url, publicId: data.public_id };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      Swal.fire({ icon: "warning", title: "Please select an image first" });
      return;
    }

    const form = e.target;
    const productData = {
      productName: form.productName.value.trim(),
      price: form.price.value,
      discount: form.discount.value || 0,
      category: form.category.value,
      brand: form.brand.value,
      AdCategory: form.AdCategory.value,
      forWhom: form.forWhom.value,
      description: form.description.value.trim(),
      ingredients: form.ingredients.value.trim(),
      howToUse: form.howToUse.value.trim(),
      origin: form.origin.value.trim()
    };

    if (
      !productData.productName ||
      !productData.price ||
      !productData.category ||
      !productData.brand ||
      !productData.forWhom
    ) {
      Swal.fire({ icon: "warning", title: "Please fill in all required fields" });
      return;
    }

    setUploading(true);

    try {
      const imageData = await uploadImageToCloudinary(imageFile);
      const { data } = await axiosSecure.post("/products", {
        ...productData,
        image: imageData.url,
        publicId: imageData.publicId,
      });

      if (data.insertedId) {
        Swal.fire({ icon: "success", title: "Product added successfully" });
        form.reset();
        setImageFile(null);
      } else {
        throw new Error("Product could not be saved");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to add product",
        text: error.message,
      });
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

          <div>
            <label className="block font-medium mb-1">Discount (%)</label>
            <input
              type="number"
              name="discount"
              className="input input-bordered w-full"
              placeholder="Enter discount"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Category</label>
            <select name="category" className="select select-bordered w-full" required>
              <option value="">-- Select Category --</option>
              {categories.map((category) => (
                <option key={category._id} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Brand</label>
            <select name="brand" className="select select-bordered w-full" required>
              <option value="">-- Select Brand --</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand.brandName}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Additional Category</label>
            <select name="AdCategory" className="select select-bordered w-full">
              <option value="">-- Select Category --</option>
              <option value="Popular Product">Popular Product</option>
              <option value="New Arrival">New Arrival</option>
              <option value="Combo">Combo</option>
              <option value="Special offer">Special offer</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">For</label>
            <select name="forWhom" className="select select-bordered w-full" required>
              <option value="">-- Select --</option>
              <option value="Oily">Oily</option>
              <option value="Dry">Dry</option>
              <option value="Combination">Combination</option>
              <option value="Combination To Dry">Combination To Dry</option>
              <option value="Combination To Oily">Combination To Oily</option>
            </select>
          </div>
           <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="label">
            <span className="label-text font-semibold">
              Description  
            </span>
          </label>

          <textarea
            name="description"
            placeholder="Enter the product description"
            className="textarea textarea-bordered w-full h-32"
            required
          ></textarea>
        </div>

        <div className="flex-1">
          <label className="label">
            <span className="label-text font-semibold">
             Ingredients 
            </span>
          </label>

          <textarea
            name="ingredients"
            placeholder="Enter the ingredients"
            className="textarea textarea-bordered w-full h-32"
          ></textarea>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
         <div className="flex-1">
          <label className="label">
            <span className="label-text font-semibold">
              How to Use
            </span>
          </label>

          <textarea
            name="howToUse"
            placeholder="Write any special instructions..."
            className="textarea textarea-bordered w-full h-32"
          ></textarea>
        </div>
         <div className="flex-1">
            <label className="block font-medium mb-1">Origin</label>
            <input
              type="text"
              name="origin"
              className="input input-bordered w-full"
              placeholder="Enter Origin"
              required
            />
          </div>
      </div>

          <button type="submit" className="btn btn-primary mt-4" disabled={uploading}>
            {uploading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
