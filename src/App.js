import React, { useState } from "react";
import GoogleSignInButton from "./components/GoogleSignInButton";
import FacebookSignInButton from "./components/FacebookSignInButton";
import SignOutButton from "./components/SignOutButton";
import AuthStateListener from "./components/AuthStateListener";
import GetUser from "./components/GetUser";
import { sign } from "web3-token";
import { useEthers, useConnector } from "@usedapp/core";
import axios from 'axios'
import RegisterForm from "./components/RegisterForm";

const App = () => {
  const [auth, setAuth] = useState(false);
  const [token, setToken] = useState('');
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
        'http://localhost:5000/user/wallet-register', {},
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'Authorization-Token': walletToken
          },
        }
      );
    } catch (error) {
      console.error('Error registering the wallet:', error);
    }
  }

  const handleConnectWallet = async () => {
    try {
      await activateBrowserWallet();
    } catch (error) {
      console.error("Failed to connect the wallet:", error);
      // Handle the error here, show a message to the user, or provide alternative actions.
    }
  };

  return (
    <div className="App">
      <AuthStateListener setAuth={setAuth} setToken={setToken} />
      {auth ? (
        <div className="signedIn">
          <GetUser token={token} />
          {!account && (
            <button onClick={() => handleConnectWallet()}>Connect Wallet</button>
          )}
          {account && <button onClick={() => deactivate()}>Disconnect</button>}
          {account && <p>Connected as: {account}</p>}
          {account && connector && (
            <p>
              <button onClick={handleWalletRegister}>Register Wallet To Backend</button>
              <br></br>
              <button
                onClick={async () => {
                  const signer = library.getSigner();
                  const web3TokenTest = await sign(
                    async (msg) => await signer.signMessage(msg),
                    "1d"
                  );
                  setWalletToken(web3TokenTest);
                }}
              >
                Sign
              </button>
            </p>
          )}
          {walletToken && <input readOnly value={walletToken} />}
          <br></br>
          <RegisterForm token = { token }/>
          <br></br>

          <SignOutButton />
          {/* <br></br>
          <GoogleRegister /> */}
        </div>
      ) : (
        <div className="signedOut">
          <h1>Welcome!</h1>
          <GoogleSignInButton setAuth={setAuth} />
          <br></br>
          <FacebookSignInButton setAuth={setAuth} />
        </div>
      )}
    </div>
  );
};

export default App;
