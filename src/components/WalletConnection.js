import {
  faCheck,
  faClipboard,
  faPlugCircleXmark,
  faSignature,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { sign } from 'web3-token';

const WalletConnection = ({
  account,
  activateBrowserWallet,
  deactivate,
  library,
  connector,
  copyAddress,
  setCopyAddress,
  walletToken,
  setWalletToken,
  copyWalletToken,
  setCopyWalletToken,
}) => {
  const handleConnectWallet = async () => {
    try {
      await activateBrowserWallet();
    } catch (error) {
      console.error('Failed to connect the wallet:', error);
    }
  };

  const handleSignMessage = async () => {
    const signer = library.getSigner();
    const web3Token = await sign(async (msg) => await signer.signMessage(msg), '1d');
    setWalletToken(web3Token);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(account);
    setCopyAddress(true);
    setTimeout(() => {
      setCopyAddress(false);
    }, 1000);
  };

  const handleCopyWalletToken = () => {
    navigator.clipboard.writeText(walletToken);
    setCopyWalletToken(true);
    setTimeout(() => {
      setCopyWalletToken(false);
    }, 1000);
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex justify-center items-center bg-gray-300 text-black rounded-md">
        <p>Web3 Wallet</p>
      </div>
      {!account ? (
        <button
          className="h-12 w-full p-3 rounded-lg border flex justify-center space-x-3 border-buttonBorder bg-buttonBackground text-white"
          onClick={handleConnectWallet}
        >
          <img
            src="https://account.maxion.gg/images/icons/Metamask.svg"
            alt="metamask"
            className="h-5"
          />
          <p>Connect Wallet</p>
        </button>
      ) : (
        <div className="w-full space-y-3">
          <div className="w-full flex space-x-3">
            <div className="h-12 w-full p-3 flex justify-between rounded-lg bg-[#282a36]">
              <input
                type="text"
                value={account}
                className="w-full outline-none bg-transparent"
                readOnly
              />
              <button className="h-full w-12 justify-end" onClick={handleCopyAddress}>
                <FontAwesomeIcon icon={copyAddress ? faCheck : faClipboard} />
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center bg-gray-300 text-black rounded-md">
            <p>Signature</p>
          </div>
          {account && connector && (
            <div className="w-full flex space-x-3">
              {walletToken && (
                <div
                  className={`h-12 ${
                    walletToken ? 'w-2/3' : 'w-0'
                  }  p-3 flex justify-between rounded-lg bg-[#282a36]`}
                >
                  <input
                    type="text"
                    value={walletToken}
                    className="w-full outline-none bg-transparent"
                    readOnly
                  />
                  <button className="h-full w-12" onClick={handleCopyWalletToken}>
                    <FontAwesomeIcon icon={copyWalletToken ? faCheck : faClipboard} />
                  </button>
                </div>
              )}
              <button
                onClick={handleSignMessage}
                className={`h-12 ${
                  walletToken ? 'w-1/3' : 'w-full'
                }  p-3 rounded-lg flex justify-center items-center space-x-3 text-black bg-primary transition-all duration-1000 ease-out`}
              >
                <FontAwesomeIcon icon={faSignature} />
                <p>Sign</p>
              </button>
            </div>
          )}
          <button
            className="w-full p-3 rounded-lg border flex justify-center items-center space-x-3 border-buttonBorder text-[#ff6c3e]"
            onClick={() => deactivate()}
          >
            <FontAwesomeIcon icon={faPlugCircleXmark} />
            <p>Disconnect</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;
