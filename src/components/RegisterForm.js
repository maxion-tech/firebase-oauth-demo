import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    // You can add validation here before sending the data to the server
    const userData = {
      username: userId,
      password: password,
    };
    // Call the API to send the user data to the server (Node.js backend)
    try {
      await axios.post(
        'https://account.landverse.dev.maxion.gg/api/user/game-register',
        userData,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
    } catch (error) {
      console.error('Error registering the wallet:', error);
      alert(error.response.data.message);
    }
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
        <FontAwesomeIcon icon={faUserPlus} />
        <p>Register</p>
      </button>
    </form>
  );
};

export default RegisterForm;
