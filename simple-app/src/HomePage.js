import React, { useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from './LogoutButton';


function HomePage({user}){

  console.log('we are in home page!')
  console.log(user)
  

  return (
    
    <div>
      <LogoutButton />
    </div>
    
  )
}

export default HomePage