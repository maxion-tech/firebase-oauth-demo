import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { TypeAnimation } from 'react-type-animation';
import { ProviderType } from '../constants';

export default function GetUser({ token, copy, provider, setCopy }) {
  const [user, setUser] = useState();

  const fetchData = async (token) => {
    try {
      const response = await axios.get(
        'https://account.landverse.dev.maxion.gg/api/user/user-data',
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
      console.log('fetching data..');
      console.log('user data = ', response.data.data);
      setUser(response.data.data); // Update state with the fetched user data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Use the fetchData function from outside the component
  useEffect(() => {
    if (token && provider.type === ProviderType.PLATFORM) {
      fetchData(token);
    }
  }, [token, provider.type]);

  return (
    <div className="space-y-3">
      <div className="h-12 w-1/2">
        {user ? (
          <TypeAnimation
            cursor={false}
            sequence={[`Hello, ${user.displayName}`, 3000, '']}
            speed={40}
            style={{ fontSize: '1.75rem' }}
            wrapper="h1"
            repeat={Infinity}
          />
        ) : (
          <h1 className="text-2xl">Maxion CMS</h1>
        )}
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
              setCopy(true);
              setTimeout(() => {
                setCopy(false);
              }, 1000);
            }}
          >
            <FontAwesomeIcon icon={copy ? faCheck : faClipboard} />
          </button>
        </div>
      </div>
    </div>
  );
}
