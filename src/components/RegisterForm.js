import React, { useState } from 'react';

const RegisterForm = ({ token }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can add validation here before sending the data to the server
    const userData = {
      username: userId,
      password: password,
    };
    // Call the API to send the user data to the server (Node.js backend)
    fetch('http://localhost:5000/user/game-register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server if needed
        console.log('Response from the server:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        User ID:
        <input type="text" value={userId} onChange={handleUserIdChange} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={handlePasswordChange} />
      </label>
      <br />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;