import React from "react";
import { Outlet, Link } from "react-router-dom"

function NavBar(){
  return (
    <>
      <nav className="nav">
      <ul>
        <Link to="/">Home</Link>
        <Link to="/submit/hw">Submit Homework</Link>
      </ul>
    </nav>
    <Outlet />
    </>
  )
}

export default NavBar