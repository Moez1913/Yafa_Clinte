import React from 'react'
import NavBar from '../../components/Home/NavBar'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/Home/Footer'

const MainLayout = () => {
  return (
    <div>
       <NavBar></NavBar> 
       <Outlet></Outlet>
       <Footer></Footer>
    </div>
  )
}

export default MainLayout