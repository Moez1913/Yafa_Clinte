import React, { useState } from "react";
import { RiDeleteBin2Line } from "react-icons/ri";
import { useLoaderData } from "react-router-dom";

const CategoryBrand = () => {
  const { categorys, brands } = useLoaderData();
  const [categoryList, setCategorys] = useState(categorys);
  const [oldCate, setOldCate] = useState([]);
  const [oldBrand, setOldBrand] = useState([]);
  const [brandList, setBrandList] = useState(brands);
  const [editingImageFile, setEditingImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingImageFile(file);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'korean_dewdrop');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/djp63rqr8/image/upload',
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

  const deleteCategory = (_id) => {

    fetch(`http://localhost:5000/categories/${_id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.deletedCount > 0) {
          const remaining = categoryList.filter(
            (category) => category._id !== _id
          );
          setCategorys(remaining);

          alert("Deleted Successfully");

          // const remaining = categorys.filter(category => category._id !== _id)
          // setCategorys(remaining)
        }
      });
  };

  // dlete brand 
  const deletBrand = (_id)=>{
    fetch(`http://localhost:5000/brands/${_id}`,{
      method:"DELETE",
    })
     .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.deletedCount > 0) {
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


  const handelOldCte = (_id) => {
   fetch(`http://localhost:5000/categories/${_id}`)
   .then(res => res.json())
   .then(data => {
     setOldCate(data);
     setEditingImageFile(null);
   })
    
    document.getElementById("my_modal_1").showModal();
  };

  const handelOldBrand = (_id) => {
   fetch(`http://localhost:5000/brands/${_id}`)
   .then(res => res.json())
   .then(data => setOldBrand(data))
    
   document.getElementById("my_modal_2").showModal();
  };

 


  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const form = e.target;
      const name = form.categoryName.value;
      let img = oldCate.photoUrl;
      let publicId = oldCate.publicId || '';
      const id = oldCate._id;

      // If new image selected, upload it to Cloudinary
      if (editingImageFile) {
        const imageData = await uploadImageToCloudinary(editingImageFile);
        if (!imageData) {
          setUploading(false);
          return;
        }
        img = imageData.url;
        publicId = imageData.publicId;
      }

      fetch(`http://localhost:5000/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, img, publicId }),
      })
        .then((res) => res.json())
        .then((data) => {
          // update local state so UI reflects the change
          if (data.matchedCount || data.modifiedCount || data.upsertedCount || data.acknowledged) {
            setCategorys((prev) =>
              prev.map((c) => (c._id === id ? { ...c, categoryName: name, photoUrl: img, publicId } : c))
            );
            try {
              document.getElementById("my_modal_1").close();
            } catch (err) {
              console.error("Failed to close modal:", err);
            }
            alert("Category updated successfully");
            setEditingImageFile(null);
          } else {
            alert("Update failed");
          }
        })
        .catch((err) => {
          console.error(err);
          alert("Update error");
        })
        .finally(() => {
          setUploading(false);
        });
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
      setUploading(false);
    }
  };
  return (
    <div className="grid grid-cols-2 gap-10 px-10 mx-auto mt-20">
      <section className="">
        <h2 className="text-3xl font-bold text-center mb-8">All Categorys</h2>
        <div className="grid grid-cols-2 gap-2 border-2 border-solid border-purple-500 p-2">
          {categoryList.map((category) => (
            <div class=" flex gap-5  px-5 bg-base-300">
              <div class="collapse-title text-xl font-medium">
                {category.categoryName}
              </div>
              <button
                onClick={() => deleteCategory(category._id)}
                className="text-red-500"
              >
                <RiDeleteBin2Line />
              </button>
              {/* Open the modal using document.getElementById('ID').showModal() method */}
              <button
                className="underline hover:text-blue-500"
                onClick={() => handelOldCte(category._id)}
              >
                Edit
              </button>
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                  <div className=" mx-auto pt-10 bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <form className="card-body" onSubmit={handleUpdateCategory}>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Category Name</span>
                        </label>
                        <input
                          type="text"
                          name="categoryName"
                          defaultValue={oldCate.categoryName}
                          className="input input-bordered"
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Category Image</span>
                        </label>
                        <input
                          type="file"
                          name="image"
                          onChange={handleEditImageChange}
                          accept="image/*"
                          className="input input-bordered w-full"
                        />
                        {editingImageFile && (
                          <div className="mt-2">
                            <p className="text-sm text-green-600 mb-1">Selected: {editingImageFile.name}</p>
                            <img 
                              src={URL.createObjectURL(editingImageFile)} 
                              alt="Preview" 
                              className="w-full h-40 object-cover rounded-lg border-2 border-gray-300"
                            />
                          </div>
                        )}
                        {!editingImageFile && oldCate.photoUrl && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 mb-1">Current Image:</p>
                            <img 
                              src={oldCate.photoUrl} 
                              alt="Current" 
                              className="w-full h-40 object-cover rounded-lg border-2 border-gray-300"
                            />
                          </div>
                        )}
                      </div>
                      <div className="form-control">
                        <label className="label"></label>
                        <input
                          className="btn btn-primary w-full "
                          type="submit"
                          value="Update"
                          disabled={uploading}
                        />
                      </div>
                    </form>
                  </div>
                  <div className="modal-action">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn">Close</button>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>
          ))}
        </div>
      </section>
      {/* brands section */}
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
    </div>
  );
};

export default CategoryBrand;
