import { faCheck, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect } from 'react';
import { ProviderType } from '../constants';

export default function GetUser({
  token,
  refreshToken,
  provider,
  copyToken,
  setCopyToken,
  copyRefreshToken,
  setCopyRefreshToken,
  email,
}) {
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
      <div className="w-full flex flex-col space-y-3">
        {/* Google Account Name Section */}
        {email && (
          <div className="w-full space-y-3">
            <div className="flex justify-center items-center bg-blue-500 text-white rounded-md">
              <p>Google Account</p>
            </div>
            <div className="h-12 w-full p-3 flex justify-center rounded-lg bg-[#282a36]">
              <span className="text-white font-medium">{email}</span>
            </div>
          </div>
        )}

        <div className="w-full space-y-3">
          <div className="flex justify-center items-center bg-gray-300 text-black rounded-md">
            <p>Access Token</p>
          </div>
          <div className="h-12 w-full p-3 flex justify-between rounded-lg bg-[#282a36]">
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
                setCopyToken(true);
                setTimeout(() => {
                  setCopyToken(false);
                }, 1000);
              }}
            >
              <FontAwesomeIcon icon={copyToken ? faCheck : faClipboard} />
            </button>
          </div>
        </div>
        <div className="w-full space-y-3">
          <div className="flex justify-center items-center bg-gray-300 text-black rounded-md">
            <p>Refresh Token</p>
          </div>
          <div className="h-12 w-full p-3 flex justify-between rounded-lg bg-[#282a36]">
            <input
              type="text"
              value={refreshToken}
              className="w-10/12 outline-none bg-transparent truncate"
              readOnly
            />
            <button
              className="h-full w-12"
              onClick={() => {
                navigator.clipboard.writeText(refreshToken);
                setCopyRefreshToken(true);
                setTimeout(() => {
                  setCopyRefreshToken(false);
                }, 1000);
              }}
            >
              <FontAwesomeIcon icon={copyRefreshToken ? faCheck : faClipboard} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
