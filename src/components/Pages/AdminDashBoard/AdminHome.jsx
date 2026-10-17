import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import UseAdmin from '../../../Hooks/useAdmin/UseAdmin'

const AdminHome = () => {
  const [isAdmin] = UseAdmin()

  if (!isAdmin) return null

  return (
    <div className="navbar bg-purple-300 shadow-sm flex items-center justify-around ">
      <NavLink className={({ isActive }) =>
    `btn btn-ghost ${isActive ? "btn-active text-primary" : ""}`
  } to="dashboard/pending">Pending</NavLink>
      <NavLink className={({ isActive }) =>
    `btn btn-ghost ${isActive ? "btn-active text-primary" : ""}`
  } to="dashboard/confirmed">Accepted</NavLink>
      <NavLink className={({ isActive }) =>
    `btn btn-ghost ${isActive ? "btn-active text-primary" : ""}`
  } to="dashboard/completed">Completed</NavLink>
    </div>
  )
}

export default AdminHome