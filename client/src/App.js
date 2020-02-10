import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

function App() {
  const [users, setUsers] = useState({
    name: "",
    bio: "",
    userList: []
  })

  const [error, setError] = useState("")

  useEffect(() => {
    const getUsers = async () => {
      const { data } = await axios('/api/users')
      console.log('getUsers', data)
      setUsers({
        ...users,
        userList: data
      })
    }
    getUsers()
  }, [])

  const handleSubmit = async event => {
    event.preventDefault()
    try {
      const { data } = await axios.post('/api/users', { name: users.name, bio: users.bio })
      const newUser = await axios.get('/api/users/'+data.id)
      setUsers({
        ...users,
        userList: [...users.userList, newUser.data]
      })

    } catch (e) {
      // setError(e.response.data.errorMessage)
      console.dir(error)
      setTimeout(setError(""), 3000)
    }
  }

  const handleChange = event => {
    setUsers({
      ...users,
      [event.target.name]: event.target.value
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <form onSubmit={handleSubmit}>
          <input value={users.name} placeholder="name" name="name" onChange={handleChange} />
          <input value={users.bio} type="textarea" placeholder="bio" name="bio" onChange={handleChange} />
          <input type="submit" value="Submit" />
        </form>
        {error ? <p>{error}</p> : null}
        {users.userList.map(u => <div><h3>{u.name}</h3><p>{u.bio}</p></div>)}
      </header>
    </div>
  );
}

export default App;
