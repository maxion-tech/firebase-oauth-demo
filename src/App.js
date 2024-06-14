import {
  faCheck,
  faClipboard,
  faPlugCircleXmark,
  faSignature,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert } from '@mui/material';
import { useConnector, useEthers } from '@usedapp/core';
import axios from 'axios';
import React, { useState } from 'react';
import { sign } from 'web3-token';
import AuthStateListener from './components/AuthStateListener';
import FacebookSignInButton from './components/FacebookSignInButton';
import GetUser from './components/GetUser';
import GoogleSignInButton from './components/GoogleSignInButton';
import RegisterForm from './components/RegisterForm';
import SignOutButton from './components/SignOutButton';

const App = () => {
  const [auth, setAuth] = useState(false);
  const [token, setToken] = useState('');
  const [copyToken, setCopyToken] = useState(false);
  const [copyAddress, setCopyAddress] = useState(false);
  const [copyWalletToken, setCopyWalletToken] = useState(false);
  const {
    account,
    activateBrowserWallet,
    deactivate,
    library,
    // activate,
    // active
  } = useEthers();
  const { connector } = useConnector();
  const [walletToken, setWalletToken] = useState();

  const handleWalletRegister = async () => {
    try {
      console.log('token = ', token);
      console.log('web3token = ', walletToken);
      await axios.post(
        'https://account.landverse.dev.maxion.gg/api/user/wallet-register',
        {
          web3Token: walletToken,
        },
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

  const handleConnectWallet = async () => {
    try {
      await activateBrowserWallet();
    } catch (error) {
      console.error('Failed to connect the wallet:', error);
      // Handle the error here, show a message to the user, or provide alternative actions.
    }
  };

  return (
    <div className="relative">
      <div className="h-screen flex justify-center items-center text-white bg-background">
        <AuthStateListener setAuth={setAuth} setToken={setToken} />
        {auth ? (
          <div className="h-fit w-1/2 space-y-4 p-10 rounded-3xl bg-subBackground">
            <GetUser token={token} copy={copyToken} setCopy={setCopyToken} />
            {!account && (
              <button
                className="w-full p-3 rounded-lg border flex justify-center space-x-3 border-buttonBorder bg-buttonBackground text-white"
                onClick={() => handleConnectWallet()}
              >
                <img
                  src="https://account.maxion.gg/images/icons/Metamask.svg"
                  alt="metamask"
                  className="h-5"
                />
                <p>Connect Wallet</p>
              </button>
            )}
            {account && (
              <div className="flex items-center space-x-5">
                <p>Connected as</p>
                <div className="h-14 w-2/3 p-3 flex justify-between rounded-xl bg-[#282a36]">
                  <input
                    type="text"
                    value={account}
                    className="w-full outline-none bg-transparent"
                    readOnly
                  />
                  <button
                    className="h-full w-12"
                    onClick={() => {
                      navigator.clipboard.writeText(account);
                      setCopyAddress(true);
                      setTimeout(() => {
                        setCopyAddress(false);
                      }, 1000);
                    }}
                  >
                    <FontAwesomeIcon icon={copyAddress ? faCheck : faClipboard} />
                  </button>
                </div>
              </div>
            )}
            {account && connector && (
              <>
                <div className="flex space-x-5">
                  <button
                    onClick={async () => {
                      const signer = library.getSigner();
                      const web3TokenTest = await sign(
                        async (msg) => await signer.signMessage(msg),
                        '1d',
                      );
                      setWalletToken(web3TokenTest);
                    }}
                    className={`${
                      walletToken ? 'w-1/3' : 'w-full'
                    } p-3 rounded-lg flex justify-center items-center space-x-3 text-black bg-primary transition-all duration-1000  
                  ease-out`}
                  >
                    <FontAwesomeIcon icon={faSignature} />
                    <p>Sign</p>
                  </button>
                  {walletToken && (
                    <div
                      className={`h-14 ${
                        walletToken ? 'w-2/3' : 'w-0'
                      }  p-3 flex justify-between rounded-xl bg-[#282a36]`}
                    >
                      <input
                        type="text"
                        value={walletToken}
                        className="w-full outline-none bg-transparent"
                        readOnly
                      />
                      <button
                        className="h-full w-12"
                        onClick={() => {
                          navigator.clipboard.writeText(walletToken);
                          setCopyWalletToken(true);
                          setTimeout(() => {
                            setCopyWalletToken(false);
                          }, 1000);
                        }}
                      >
                        <FontAwesomeIcon icon={copyWalletToken ? faCheck : faClipboard} />
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleWalletRegister}
                  className="w-full p-3 rounded-lg flex justify-center items-center space-x-3 text-black bg-primary"
                >
                  <FontAwesomeIcon icon={faWallet} />
                  <p>Register Wallet To Backend</p>
                </button>
              </>
            )}
            {account && (
              <button
                className="w-full p-3 rounded-lg border flex justify-center items-center space-x-3 border-buttonBorder text-[#ff6c3e]"
                onClick={() => deactivate()}
              >
                <FontAwesomeIcon icon={faPlugCircleXmark} />
                <p>Disconnect</p>
              </button>
            )}

            <RegisterForm token={token} />
            <SignOutButton />
          </div>
        ) : (
          <div className="h-full w-1/2 flex flex-col space-y-10 items-center justify-center">
            <div className="h-1/2 w-2/3 space-y-7 p-10 rounded-3xl bg-subBackground">
              <div className="flex items-center space-x-5">
                <img
                  src="https://account.maxion.gg/images/icons/Vector.svg"
                  alt="maxion"
                />
                <span className="h-10 w-[0.5px] bg-[#272d31]"></span>
                <h1 className="text-2xl">Maxion Account</h1>
              </div>
              <h1 className="text-[#808080]">Continue with</h1>
              <div className="space-y-5 flex flex-col items-center">
                <GoogleSignInButton setAuth={setAuth} />
                <FacebookSignInButton setAuth={setAuth} />
              </div>
            </div>
          </div>
        )}
      </div>
      {(copyAddress || copyToken || copyWalletToken) && (
        <Alert
          icon={false}
          sx={{ backgroundColor: '#282a36', color: '#FFC400' }}
          className="absolute bottom-10 right-10 bg-[#282a36] text-primary"
        >
          Copied to clipboard
        </Alert>
      )}
    </div>
  );
};

export default App;
