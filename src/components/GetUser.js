import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { TypeAnimation } from 'react-type-animation';

// Move the fetchData function outside of the component
const fetchData = async (token, setUser) => {
  try {
    const response = await axios.get('http://localhost:5000/user/user-data', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    console.log('fetching data..');
    console.log('user data = ', response.data.data);
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
    <div className="space-y-3">
      <div className="w-1/2">
        <TypeAnimation
          cursor={false}
          sequence={[`Hello, ${user.displayName}`]}
          speed={40}
          style={{ fontSize: '1.25rem' }}
          wrapper="h1"
          repeat={0}
        />
      </div>
      <div className="flex items-center space-x-5">
        <p>Access Token</p>
        <div className="h-14 w-2/3 p-3 flex justify-between rounded-xl bg-[#282a36]">
          <input
            type="text"
            value={token}
            className="w-10/12 outline-none bg-transparent truncate"
            readOnly
          />
          <button
            className="h-full w-12"
            onClick={() => {
              navigator.clipboard.writeText(token);
              alert('Copied token to clipboard');
            }}
          >
            <FontAwesomeIcon icon={faClipboard} />
          </button>
        </div>
      </div>
    </div>
  );
}
