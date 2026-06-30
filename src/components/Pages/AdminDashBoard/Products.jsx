
import { useState } from 'react';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { MdEdit } from 'react-icons/md';
import { useLoaderData } from 'react-router-dom';

const Products = () => {
     const initialProducts = useLoaderData();
     const [productList, setProducts] = useState(initialProducts);
     const [editingProduct, setEditingProduct] = useState(null);
     const [editingImageFile, setEditingImageFile] = useState(null);
     const [uploading, setUploading] = useState(false);
     const [formData, setFormData] = useState({
       productName: '',
       price: '',
       discount: '',
       category: '',
       brand: '',
       AdCategory: '',
       forWhom: '',
       image: ''
     });

     const handleDelete = (_id) => {
       if (window.confirm('Are you sure you want to delete this product?')) {
         fetch(`http://localhost:5000/products/${_id}`, {
           method: 'DELETE'
         })
         .then(res => res.json())
         .then(data => {
           console.log('Delete response:', data);
           if (data.deletedCount > 0 || data.acknowledged) {
             setProducts(productList.filter(p => p._id !== _id));
             alert('Product deleted successfully');
           } else {
             alert('Failed to delete product');
           }
         })
         .catch(error => {
          //  console.error('Delete error:', error);
           alert('Error deleting product: ' + error.message);
         });
       }
     };

     const handleEdit = (product) => {
       setEditingProduct(product._id);
       setFormData({
         productName: product.productName,
         price: product.price,
         discount: product.discount || '',
         category: product.category,
         brand: product.brand,
         AdCategory: product.AdCategory,
         forWhom: product.forWhom,
         image: product.image || ''
       });
       document.getElementById("edit_modal").showModal();
     };

     const handleFormChange = (e) => {
       const { name, value } = e.target;
       setFormData(prev => ({
         ...prev,
         [name]: value
       }));
     };

     const handleEditImageChange = (e) => {
       const file = e.target.files[0];
       if (file) {
         setEditingImageFile(file);
       }
     };

     const uploadImageToCloudinary = async (file) => {
       const cloudFormData = new FormData();
       cloudFormData.append('file', file);
       cloudFormData.append('upload_preset', 'korean_dewdrop');

       try {
         const response = await fetch(
           'https://api.cloudinary.com/v1_1/djp63rqr8/image/upload',
           {
             method: 'POST',
             body: cloudFormData
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

     const handleUpdateProduct = async (e) => {
       e.preventDefault();
       setUploading(true);

       try {
         let imageUrl = formData.image;
         let publicId = formData.publicId || '';

         // If new image selected, upload it to Cloudinary
         if (editingImageFile) {
           const imageData = await uploadImageToCloudinary(editingImageFile);
           if (!imageData) {
             setUploading(false);
             return;
           }
           imageUrl = imageData.url;
           publicId = imageData.publicId;
         }

         const updatedFormData = {
           ...formData,
           image: imageUrl,
           publicId: publicId
         };
         
         const response = await fetch(`http://localhost:5000/products/${editingProduct}`, {
           method: 'PUT',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify(updatedFormData)
         });

         const data = await response.json();
         console.log('Update response:', data);
         
         if (data.modifiedCount > 0 || data.acknowledged) {
           // Update local state
           const updatedProducts = productList.map(p => 
             p._id === editingProduct ? { ...p, ...updatedFormData } : p
           );
           setProducts(updatedProducts);
           alert('Product updated successfully');
           document.getElementById("edit_modal").close();
           setEditingProduct(null);
           setEditingImageFile(null);
         } else {
           alert('No changes made');
         }
       } catch (error) {
         console.error('Update error:', error);
         alert('Error updating product: ' + error.message);
       } finally {
         setUploading(false);
       }
     };

    return (
       <div className="px-10 mx-auto mt-10 mb-10">
             <section className="">
               <h2 className="text-3xl font-bold text-center mb-8">All Products</h2>
               <div className="overflow-x-auto">
                 <table className="table table-zebra w-full">
                   <thead>
                     <tr className="bg-purple-500 text-white">
                       <th>Image</th>
                       <th>Product Name</th>
                       <th>Price</th>
                       <th>Category</th>
                       <th>Brand</th>
                       <th>Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     {productList.map((product) => (
                       <tr key={product._id}>
                         <td>
                           <img 
                             src={product.image} 
                             alt={product.productName}
                             className='h-16 w-16 object-cover rounded'
                           />
                         </td>
                         <td>
                           <h3 className="font-semibold">{product.productName}</h3>
                         </td>
                         <td>৳ {product.price}</td>
                         <td>{product.category}</td>
                         <td>{product.brand}</td>
                         <td>
                           <div className="flex gap-3">
                             <button
                               onClick={() => handleEdit(product)}
                               className="btn btn-sm btn-info text-white"
                               title="Edit"
                             >
                               <MdEdit /> Edit
                             </button>
                             <button
                               onClick={() => handleDelete(product._id)}
                               className="btn btn-sm btn-error text-white"
                               title="Delete"
                             >
                               <RiDeleteBin2Line /> Delete
                             </button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </section>

             {/* Edit Modal */}
             <dialog id="edit_modal" className="modal">
               <div className="modal-box w-full max-w-md">
                 <h3 className="font-bold text-lg mb-4">Edit Product</h3>
                 <form onSubmit={handleUpdateProduct} className="space-y-4">
                   <div className="form-control">
                     <label className="label">
                       <span className="label-text">Product Name</span>
                     </label>
                     <input
                       type="text"
                       name="productName"
                       value={formData.productName}
                       onChange={handleFormChange}
                       className="input input-bordered w-full"
                       required
                     />
                   </div>

                   <div className="form-control">
                     <label className="label">
                       <span className="label-text">Price</span>
                     </label>
                     <input
                       type="number"
                       name="price"
                       value={formData.price}
                       onChange={handleFormChange}
                       className="input input-bordered w-full"
                       required
                     />
                   </div>

                   <div className="form-control">
                     <label className="label">
                       <span className="label-text">Discount (%)</span>
                     </label>
                     <input
                       type="number"
                       name="discount"
                       value={formData.discount}
                       onChange={handleFormChange}
                       className="input input-bordered w-full"
                     />
                   </div>

                   <div className="form-control">
                     <label className="label">
                       <span className="label-text">Upload Image</span>
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
                     {!editingImageFile && formData.image && (
                       <div className="mt-2">
                         <p className="text-sm text-gray-600 mb-1">Current Image:</p>
                         <img 
                           src={formData.image} 
                           alt="Current" 
                           className="w-full h-40 object-cover rounded-lg border-2 border-gray-300"
                         />
                       </div>
                     )}
                   </div>

                   <div className="form-control">
                     <label className="label">
                       <span className="label-text">Category</span>
                     </label>
                     <input
                       type="text"
                       name="category"
                       value={formData.category}
                       onChange={handleFormChange}
                       className="input input-bordered w-full"
                       required
                     />
                   </div>

                   <div className="form-control">
                     <label className="label">
                       <span className="label-text">Brand</span>
                     </label>
                     <input
                       type="text"
                       name="brand"
                       value={formData.brand}
                       onChange={handleFormChange}
                       className="input input-bordered w-full"
                       required
                     />
                   </div>

                   <div className="form-control">
                     <label className="label">
                       <span className="label-text">Additional Category</span>
                     </label>
                     <input
                       type="text"
                       name="AdCategory"
                       value={formData.AdCategory}
                       onChange={handleFormChange}
                       className="input input-bordered w-full"
                       required
                     />
                   </div>

                   <div className="form-control">
                     <label className="label">
                       <span className="label-text">For (Skin Type)</span>
                     </label>
                     <input
                       type="text"
                       name="forWhom"
                       value={formData.forWhom}
                       onChange={handleFormChange}
                       className="input input-bordered w-full"
                       required
                     />
                   </div>

                   <div className="modal-action">
                     <button type="submit" className="btn btn-primary" disabled={uploading}>
                       {uploading ? 'Uploading...' : 'Update Product'}
                     </button>
                     <form method="dialog">
                       <button className="btn">Cancel</button>
                     </form>
                   </div>
                 </form>
               </div>
             </dialog>
           </div>
    );
};

export default Products;