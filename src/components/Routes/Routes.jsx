import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../../Layout/MainLayout/MainLayout";
import ShopProvider from "../../providers/ShopProvider";
import Home from "../Home/Home";
import AllProducts from "../Pages/AllProducts";
import ProductDetails from "../Pages/ProductDetails";
import CustomizeForm from "../Pages/AdminDashBoard/CustomizeForm";
import AddProduct from "../Pages/AdminDashBoard/AddProduct";
import Login from "../Users/Login";
import SignUp from "../Users/SignUp";
import CategoryBrand from "../Pages/AdminDashBoard/CategoryBrand";
import Products from "../Pages/AdminDashBoard/Products";
import { Cart } from "../Pages/UserDashboard/Cart";
import WishList from "../Pages/UserDashboard/WishList";
import OrderPage from "../Pages/OrderPage";

import DashBoardLayout from "../../Layout/DashboardLayout/DashBoardLayout";
import Users from "../Pages/AdminDashBoard/Users";
import PrivetRout from "./PrivetRout";
import Brand from "../Pages/AdminDashBoard/Brand";
import PendingOrders from "../Pages/AdminDashBoard/PendingOrders";


export const router=createBrowserRouter([
    {
        path:"/",
        element:<ShopProvider><MainLayout /></ShopProvider>,
        children:[
            {
                index: true,
                element:<Home></Home>
            },
      {
       path:'/allProducts',
       element:<AllProducts></AllProducts>
      
      },
      {
        path:'/product/:id',
        element:<ProductDetails></ProductDetails>,
        loader:({params})=>fetch(`http://localhost:5000/products/${params.id}`)
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
        path:'/cart',
        element:<PrivetRout><Cart></Cart></PrivetRout>,
        
      },
      {
        path:'/wishlist',
        element:<PrivetRout><WishList></WishList></PrivetRout>
      },
      {
        path:'/OrderPage',
        element:<OrderPage></OrderPage>
      }
      
        ]
    },
    {
       path:'dashboard', 
       element:<ShopProvider><DashBoardLayout /></ShopProvider>,
       children:[
         {
            path:'dashboard/users',
            element:<Users></Users>

         },
          {
        path: "dashboard/catebrand",
        element: <CustomizeForm></CustomizeForm>
      }
      ,
     
      {
        path:'dashboard/addproduct',
        element:<AddProduct></AddProduct>
      }
      ,
      {
        path:'dashboard/category',
        element:<CategoryBrand></CategoryBrand>,
        loader:()=>fetch('http://localhost:5000/categories')
        },
        {
          path:'dashboard/brand',
          element:<Brand></Brand>,
      
        },
        {
          path:'dashboard/pending',
          element:<PendingOrders></PendingOrders>
        }
        ,
      {
        path:'dashboard/products',
        element:<Products></Products>,
        loader:()=>fetch('http://localhost:5000/products')

      }

        
      

       ]
    }
])