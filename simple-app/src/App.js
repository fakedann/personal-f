import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import LoginButton from './LoginButton';
import HomePage from './HomePage';
import NavBar from './NavBar';
import SubmitHw from './SubmitHw';
import Assignment from './Assignment';

function App() {


  const {isLoading, error} = useAuth0()
  const {user} = useAuth0()
  const [newUser, setNew] = useState('')

  function createUserinDatabase(){
    const newUser = new FormData()
    newUser.append('email', user.email)
    newUser.append('role', user.Role_in_company)


    fetch(`http://127.0.0.1:5000/createUser`, {
      method: "POST",
      body: newUser,
    }).then((r) => {
      if (r.ok) {
        r.json().then( (resp) => {
          console.log(resp)
          setNew(resp.email)
        })
      } else{
        r.json().then( (err) => console.log(err))
      }
    })
  }


  if(user){
    if(user.login_count === 1 && newUser === ''){
      createUserinDatabase()
    }else{
      console.log("already created!")
    }

    return <BrowserRouter>
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<HomePage user={user}/>} />
        <Route exact path="/submit/hw" element={<SubmitHw user={user}/>} />
        <Route exact path="/assignments" element={<Assignment user={user}/>} />  
      </Route>
    </Routes>
  </BrowserRouter>
    
  }
  else{
    return (
      <div className="App">
        <div className="loginBox">
          <h1>Please, log or sign into your Homework Master account.</h1>
            {error && <p>Authentication error!</p>}
            {!error && isLoading && <p>Loading!</p>}
            {!error && !isLoading && (
              <div>
                <LoginButton />
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default App;
