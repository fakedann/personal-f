import React, { useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';


function LogoutButton(){
  
  const {logout, isAuthenticated} = useAuth0();

  return (
    isAuthenticated && (
      <div>
        <button onClick={() => logout()}>
          Sign Out
        </button>
      </div>
      )
  )
}

export default LogoutButton