import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

function App() {

  console.log('setting up new branch and repo')

  const {isLoading, error} = useAuth0()
  const {user, isAuthenticated} = useAuth0()
  const [formData, setFormData] = useState({
    name: "",

  })
  const [image, setImage] = useState('')
  const [holder, setHolder] = useState('')

  function handleImage(event){
    console.log(event.target.files[0])
    setImage(event.target.files[0])
  }

  function handleSubmit(event){
    event.preventDefault()
    console.log(formData.name)
    const items = new FormData()
    // items.append('image', image)
    items.append('name', formData.name)
    items.append('files[]', image)
    items.append('role', user? user.Role_in_company: 'nada')

    fetch(`http://127.0.0.1:5000/username`, {
      method: "POST",
      body: items,
    }).then((r) => {
      if (r.ok) {
        r.json().then( (resp) => console.log(resp))
      } else{
        r.json().then( (err) => console.log(err))
      }
    })
  }

  function handleChange(event) {
    const name = event.target.name;
    let value = event.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  return (
    <div className="App">
      <h1>Login here!</h1>
      {error && <p>Authentication error!</p>}
      {!error && isLoading && <p>Loading!</p>}
      {!error && !isLoading && (
        <div>
          <LoginButton />
          {isAuthenticated ? console.log(user): null}
          <LogoutButton />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          value={formData.name}
        />
        <input type="file" name="file" encType="multipart/form-data" onChange={handleImage}/>
        
        <button id="submit" type="submit">Submit</button> 
      </form>
      <img src={holder}/>
    </div>
  );
}

export default App;
