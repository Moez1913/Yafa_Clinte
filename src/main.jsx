import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './components/Home/Home.jsx';
import Routes from './components/Routes/Routes.jsx';
import CustomizeForm from './components/Pages/CustomizeForm.jsx';
import Login from './components/Users/Login.jsx';
import SignUp from './components/Users/SignUp.jsx';
import AddProduct from './components/Pages/AddProduct.jsx';
import AllProducts from './components/Pages/AllProducts.jsx';
import AuthProvider from './providers/AuthProvider.jsx';
import CategoryBrand from './components/Pages/CategoryBrand.jsx';
import Products from './components/Pages/Products.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Routes></Routes>,
    children:[
      {
        path: "/",
        element: <Home></Home>
      },
      {
       path:'/allProducts',
       element:<AllProducts></AllProducts>,
       loader:()=>fetch('http://localhost:5000/products')
      },
      {
        path: "/catebrand",
        element: <CustomizeForm></CustomizeForm>
      },
      {
        element: <CustomizeForm></CustomizeForm>
      },
      {
        path:'/addproduct',
        element:<AddProduct></AddProduct>
      },
      {
        path:'/login',
        element:<Login></Login>
      },
      {
        path:'/signup',
        element:<SignUp></SignUp>
      },
      {
        path:'/categoryBrand',
        element:<CategoryBrand></CategoryBrand>,
        loader:async()=>{
         const[categorysres,brandres]= await Promise.all([
          fetch('http://localhost:5000/categories'),
          
          fetch('http://localhost:5000/brands')
         ]);
         const [categorys, brands] = await Promise.all([
            categorysres.json(),
          
            brandres.json()
          ]);
          return {categorys,brands}
        }

        
      },
      {
        path:'/products',
        element:<Products></Products>

      }
    ]
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
