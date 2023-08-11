import React, { useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from './LogoutButton';

function HomePage({user}){
  console.log(user)

  return (
    
    <div className="homePage">
      <h1>Welcome to Homework Master!</h1>
      <h3>Email: {user.email}</h3>
      <h3>Account type: {user.Role_in_company === "pro" ? "Professor": "Student"}</h3>
      <LogoutButton />
    </div>
    
  )
}

export default HomePage