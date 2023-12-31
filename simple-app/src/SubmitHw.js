import { useState } from 'react';

function SubmitHw({user}){

  const [formData, setFormData] = useState({
    title: "",
  })
  const [file, setFile] = useState('')
  const [view, setView] = useState('')

  function handleFile(event){
    setFile(event.target.files[0])
  }

  function handleSubmit(event){
    event.preventDefault()
    const homework = new FormData()
    homework.append('email', user.email)
    homework.append('title', formData.title)
    homework.append('files[]', file)

    fetch(`http://127.0.0.1:5000/createHomework`, {
      method: "POST",
      body: homework,
    }).then((r) => {
      if (r.ok) {
        r.json().then( (resp) => null)
      } else{
        r.json().then( (err) => console.log(err))
      }
    })
    setView('sub')
    setFormData({
      ...formData,
      ['title']: '',
    })
    setFile('')
  }

  function handleChange(event) {
    const name = event.target.name;
    let value = event.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  if (view !== ''){
    return <div id="hwSubmission">
      <p>Success!!!</p>
      <button className="botones" onClick={ () => setView('')}>Dismiss</button>
    </div>
  }
  

  return (
    <div className="homePage">
       <p>Submit your homework</p>
       <form onSubmit={handleSubmit}>
          <label>Assignment title:</label>
          <input
            type="text"
            name="title"
            onChange={handleChange}
            value={formData.title}
          />
          <div className="asgBotones">
            <input type="file" name="file" encType="multipart/form-data" onChange={handleFile}/>
            
            <button className="botones" type="submit">Submit</button> 
          </div>
        </form>
    </div>
  )
}

export default SubmitHw