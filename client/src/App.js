import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

function App() {
  const [users, setUsers] = useState({
    user: "",
    bio: "",
    userList: []
  })

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



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <form
          onSubmit={handleSubmit}></form>
        {users.userList.map(u => <div><h3>{u.name}</h3><p>{u.bio}</p></div>)}
      </header>
    </div>
  );
}

export default App;
