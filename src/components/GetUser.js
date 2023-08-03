import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Move the fetchData function outside of the component
const fetchData = async (token, setUser) => {
  try {
    const response = await axios.get('http://localhost:5000/user/user-data', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    console.log('fetching data..');
    console.log("user data = ", response.data.data);
    setUser(response.data.data); // Update state with the fetched user data
    console.log('user = ', response.data.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export default function GetUser({ token }) {
  const [user, setUser] = useState({});

  // Use the fetchData function from outside the component
  useEffect(() => {
    if (token) {
      fetchData(token, setUser);
    }
  }, [token]);

  return (
    <div>
      <h1>Hello, {user.displayName}</h1>
      <div style={{display: 'flex', gap: '15px'}}>
        <h2>Access Token</h2>
        <input readOnly value={token} />
      </div>
      <div style={{display: 'flex', gap: '15px'}}>
        <h2>Refresh Token</h2>
        {/* <input readOnly value={} /> */}
      </div>
    </div>
  );
}
