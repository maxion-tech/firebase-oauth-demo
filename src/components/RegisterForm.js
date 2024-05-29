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
    <form
      onSubmit={handleSubmit}
      className="space-y-3 border border-buttonBorder rounded-lg p-5"
    >
      <label className="flex items-center space-x-10">
        <p>User ID:</p>
        <div className="h-14 w-2/3 p-3 flex justify-between rounded-xl bg-[#282a36]">
          <input
            type="text"
            value={userId}
            className="w-10/12 outline-none bg-transparent truncate"
            placeholder="userId"
            onChange={handleUserIdChange}
          />
        </div>
      </label>
      <label className="flex items-center space-x-5">
        <p>Password:</p>
        <div className="h-14 w-2/3 p-3 flex justify-between rounded-xl bg-[#282a36]">
          <input
            type="password"
            value={password}
            className="w-10/12 outline-none bg-transparent truncate"
            placeholder="password"
            onChange={handlePasswordChange}
          />
        </div>
      </label>
      <button
        type="submit"
        className="w-full p-3 rounded-lg flex justify-center items-center space-x-3 text-black bg-primary"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
