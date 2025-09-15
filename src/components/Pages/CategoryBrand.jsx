import React, { useState } from 'react';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { useLoaderData } from 'react-router-dom';

const CategoryBrand = () => {
    const { categorys, brands } = useLoaderData()
    const [categoryList, setCategorys] = useState(categorys);

    const deleteCategory = _id => {
        fetch(`http://localhost:5000/categories/${_id}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.deletedCount > 0) {
                    const remaining = categoryList.filter(category => category._id !== _id)
                    setCategorys(remaining)
                    alert('Deleted Successfully')
                    // const remaining = categorys.filter(category => category._id !== _id)
                    // setCategorys(remaining)
                }
            })
    }
    return (
        <div className='grid grid-cols-2 gap-10 px-10 mx-auto mt-20'>
            <section className=''>
                <h2 className='text-3xl font-bold text-center mb-8'>All Categorys</h2>
                <div className='grid grid-cols-2 gap-2 border-2 border-solid border-purple-500 p-2'>
                    {
                        categoryList.map(category => (<div class=" flex gap-5  px-5 bg-base-300">

                            <div class="collapse-title text-xl font-medium">{category.categoryName}</div>
                            < button onClick={() => deleteCategory(category._id)} className='text-red-500'><RiDeleteBin2Line /></button>
                            {/* Open the modal using document.getElementById('ID').showModal() method */}
                            <button className="underline hover:text-blue-500" onClick={() => document.getElementById('my_modal_1').showModal()}>Edit</button>
                            <dialog id="my_modal_1" className="modal">
                                <div className="modal-box">
                                    <div className=" mx-auto pt-10 bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                                        <form  className="card-body">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Category Name</span>
                                                </label>
                                                <input type="text" name="categoryName" placeholder="CategoryName" className="input input-bordered" required />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Photo Url</span>
                                                </label>
                                                <input type="url" name="photoUrl" placeholder="Url" className="input input-bordered" required />

                                            </div>
                                            <div className="form-control">
                                                <label className="label">

                                                </label>
                                                <input className="btn btn-primary w-full " type="submit" value="Add Category" />

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
                        </div>))
                    }
                </div>
            </section>
            {/* brands section */}
            <section>
                <h2 className='text-3xl font-bold text-center mb-8'>All Brands</h2>
                <div className='grid grid-cols-2 gap-2'>
                    {
                        brands.map(brand => (<div class=" flex gap-5 bg-base-200 px-5">

                            <div class="collapse-title text-xl font-medium">{brand.brandName}

                            </div>
                            <button className='text-red-500'><RiDeleteBin2Line /></button>
                              <button className="underline hover:text-blue-500" onClick={() => document.getElementById('my_modal_1').showModal()}>Edit</button>
                            <dialog id="my_modal_1" className="modal">
                                <div className="modal-box">
                                    <div className=" mx-auto pt-10 bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                                        <form  className="card-body">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Category Name</span>
                                                </label>
                                                <input type="text" name="categoryName" placeholder="CategoryName" className="input input-bordered" required />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Photo Url</span>
                                                </label>
                                                <input type="url" name="photoUrl" placeholder="Url" className="input input-bordered" required />

                                            </div>
                                            <div className="form-control">
                                                <label className="label">

                                                </label>
                                                <input className="btn btn-primary w-full " type="submit" value="Add Category" />

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
                        </div>))
                    }
                </div>
            </section>


        </div>
    );
};

export default CategoryBrand;