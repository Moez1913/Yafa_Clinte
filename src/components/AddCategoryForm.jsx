import { useEffect, useState } from "react";


const AddCategoryForm = () => {
  const [oldBrand ,setOldBrand] =useState([])
  const[brands,setBrands]= useState([oldBrand]);

  useEffect(()=>{
    fetch('http://localhost:5000/brands')
    .then(res => res.json())
    .then(data => {
        setOldBrand(data);
    })
  },[])

  

const handleCategory= e =>{
    e.preventDefault() 
    const form = e.target;
    const categoryName = form.categoryName.value;
    const photoUrl = form.photoUrl.value;
    
    const category = {
      categoryName,
      photoUrl
    };
    
  fetch('http://localhost:5000/categories',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(category)
  
  } )
  .then(res => res.json())
  .then(data => {
    if(data.insertedId){
      alert('Category added successfully')
      form.reset()
    }
  })
}

// adding brand name

const handleBrand= e =>{
  
    e.preventDefault() 
    const form = e.target;
    const brandName = form.brandName.value;
   
    
    const newbrand = {
      brandName
     
    };
    console.log(newbrand)
    
    
  fetch('http://localhost:5000/brands',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newbrand)
  
  } )
  .then(res => res.json())
  .then(data => {
    if(data.insertedId){
      alert('Brands added successfully')
    const allBrands = [...oldBrand, newbrand]
    setBrands(allBrands)
      console.log(brands)
      
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
        <div className="form-control">
          <label className="label">
            <span className="label-text">Photo Url</span>
          </label>
          <input type="url" name="photoUrl" placeholder="Url" className="input input-bordered" required />
         
        </div>
        <div className="form-control">
          <label className="label">
            
          </label>
          <input  className="btn btn-primary w-full " type="submit" value="Add Category" />
         
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
