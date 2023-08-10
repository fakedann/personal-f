import React, { useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';


function LoginButton(){
  
  const {loginWithRedirect, isAuthenticated} = useAuth0();

  return (
    !isAuthenticated && (
    <div>
      <button className="botones" onClick={() => loginWithRedirect()}>
        Sign In
      </button>
    </div>
    )
  )
}

export default LoginButton