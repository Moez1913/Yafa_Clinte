import React from 'react'
import { Link } from 'react-router-dom'

const AdminHome = () => {
  return (
  <div className="navbar bg-purple-300 shadow-sm flex items-center justify-around ">
   <Link to='dashboard/pending'>Pending</Link>
   <Link>Accepted</Link>
   <Link>Completed</Link>
</div>
  )
}

export default AdminHome