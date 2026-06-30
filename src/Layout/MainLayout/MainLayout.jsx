import React from 'react'
import NavBar from '../../components/Home/NavBar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
       <NavBar></NavBar> 
       <Outlet></Outlet>
    </div>
  )
}

export default MainLayout