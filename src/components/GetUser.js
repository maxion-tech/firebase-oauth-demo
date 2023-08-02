import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

export default function GetUser({ token, refreshToken }) {
  const [user, setUser] = useState({});

  const fetchData = useCallback(async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/user/user-data', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      console.log('fetching data..');
      console.log("user data = ", response.data.data);
      setUser(response.data.data); // Update state with the fetched user data
      console.log('user = ', user);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []); // Empty dependency array since fetchData doesn't depend on any props or state

  // Run fetchData only once during the initial mount
  useEffect(() => {
    if (token) {
      fetchData(token);
    }
  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
      <h1>Hello, {user.displayName}</h1>
      <div style={{display: 'flex', gap: '15px'}}>
        <h2>Access Token</h2>
        <input readOnly value={token} />
      </div>
      <div style={{display: 'flex', gap: '15px'}}>
        <h2>Refresh Token</h2>
        <input readOnly value={refreshToken} />
      </div>
    </div>
  );
}
