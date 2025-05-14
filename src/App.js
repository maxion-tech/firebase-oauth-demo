import {
  faCheck,
  faChevronDown,
  faClipboard,
  faPlugCircleXmark,
  faSignature,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Transition,
} from '@headlessui/react';
import { Alert } from '@mui/material';
import {
  BSCTestnet,
  DAppProvider,
  useConnector,
  useContractFunction,
  useEthers,
} from '@usedapp/core';
import { constants, Contract } from 'ethers';
import { formatEther, Interface, parseUnits } from 'ethers/lib/utils';
import React, { Fragment, useEffect, useState } from 'react';
import { sign } from 'web3-token';
import '../src/index.css';
import AuthStateListener from './components/AuthStateListener';
import FacebookSignInButton from './components/FacebookSignInButton';
import GetUser from './components/GetUser';
import GoogleSignInButton from './components/GoogleSignInButton';
import SignOutButton from './components/SignOutButton';
import { chains, contracts, operators, providers } from './constants';
import ION_ABI from './constants/abis/ion.json';
import NFT_ABI from './constants/abis/nft.json';
import axios from 'axios';
import { apiUrls, cdnUrls } from './config';

const MaxiTestnet = {
  chainId: 898,
  chainName: 'Maxi Testnet',
  isTestChain: true,
  isLocalChain: false,
  multicallAddress: '',
  rpcUrl: chains[0].rpcUrl,
  nativeCurrency: {
    name: 'MGAS',
    symbol: 'MGAS',
    decimals: 18,
  },
};

const config = {
  networks: [BSCTestnet, MaxiTestnet],
  autoConnect: true,
};

const App = () => {
  const [auth, setAuth] = useState(false);
  const [token, setToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [copyToken, setCopyToken] = useState(false);
  const [copyRefreshToken, setCopyRefreshToken] = useState(false);
  const [copyAddress, setCopyAddress] = useState(false);
  const [copyWalletToken, setCopyWalletToken] = useState(false);
  const [provider, setProvider] = useState(providers[0]);
  const [chain, setChain] = useState(chains[0]);
  const [operator, setOperator] = useState(operators[chains[0].chainId][0]);
  const [walletToken, setWalletToken] = useState();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [allowanceAmount, setAllowanceAmount] = useState();
  const [inventories, setInventories] = useState([]);

  const { account, activateBrowserWallet, deactivate, library, switchNetwork } =
    useEthers();
  const { connector } = useConnector();

  const nftContract = new Contract(contracts[898].nft, new Interface(NFT_ABI));
  const { send: approve } = useContractFunction(nftContract, 'setApprovalForAll', {
    transactionName: 'Approve NFTs',
  });

  const ionContract = new Contract(contracts[898].ion, new Interface(ION_ABI));
  const { send: increaseAllowance } = useContractFunction(ionContract, 'approve', {
    transactionName: 'Increase Allowance',
  });
  const { send: decreaseAllowance } = useContractFunction(
    ionContract,
    'decreaseAllowance',
    {
      transactionName: 'Decrease Allowance',
    },
  );

  const handleConnectWallet = async () => {
    try {
      await activateBrowserWallet();
    } catch (error) {
      console.error('Failed to connect the wallet:', error);
      // Handle the error here, show a message to the user, or provide alternative actions.
    }
  };

  const handleApproveNFTs = async (approved) => {
    try {
      switchNetwork(chain.chainId);
      const message = approved
        ? `Approve ${operator.name} to use all of your NFTs`
        : `Disapprove ${operator.name} to use all of your NFTs`;
      const confirm = window.confirm(message);
      if (confirm) approve(operator.address, approved);
    } catch (error) {
      console.error('Error approving the NFTs:', error);
    }
  };

  const handleAllowanceION = async (increased) => {
    try {
      switchNetwork(chain.chainId);
      const message = increased
        ? `Increase allowance for ${operator.name} to use your ION`
        : `Decrease allowance for ${operator.name} to use your ION`;
      const amountWei = parseUnits(allowanceAmount, 18).toString();
      const confirm = window.confirm(message);

      if (confirm)
        increased
          ? increaseAllowance(operator.address, amountWei)
          : decreaseAllowance(operator.address, amountWei);
    } catch (error) {
      console.error('Error allowance ION:', error);
    }
  };

  const getMintInventories = async () => {
    await axios
      .get(`${apiUrls.maxi}/mint-inventory`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Server-Id': 1,
        },
      })
      .then((res) => {
        setInventories(res.data.filter(Boolean));
      })
      .catch((error) => console.log('error: ', error.response.data));
  };

  useEffect(() => {
    getMintInventories();
  }, [token]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const bulkMintNFTs = async () => {
    const inventoryIds = inventories.map((inventory) => inventory.id).filter(Boolean);
    for (const inventoryId of inventoryIds) {
      try {
        await axios
          .post(
            `${apiUrls.maxi}/mint-inventory/mint`,
            { mintInventoryId: inventoryId },
            { headers: { Authorization: `Bearer ${token}`, 'X-Server-Id': 1 } },
          )
          .then(async (res) => {
            console.log('🚀 res:', res);
            console.log(res?.data?.tx?.hash);
            await getMintInventories();
          });
        await sleep(2000);
      } catch (error) {
        console.log('🚀 error:', error);
        console.log('error: ', error.response.data);
        await sleep(4000);
      }
    }
  };

  return (
    <DAppProvider config={config}>
      <AuthStateListener
        setAuth={setAuth}
        setToken={setToken}
        setRefreshToken={setRefreshToken}
        setProvider={setProvider}
        firebaseApp={provider.firebaseApp}
      />
      <div className="relative">
        <div
          className={
            'h-full flex flex-col justify-center items-center text-white bg-subBackground2'
          }
        >
          {auth ? (
            <>
              <div className="flex justify-center items-center space-x-6">
                <div className="h-24 flex justify-center items-center space-x-2 text-4xl font-poppins font-extrabold">
                  <p>M</p>
                  <p>A</p>
                  <img
                    src="https://cdn.prod.website-files.com/62ecfefc58b878e68b3c7c20/6673f3ade8f353e75cd1f090_Vector.svg"
                    loading="lazy"
                    alt="maxion logo"
                    className="h-8"
                  />
                  <p>I</p>
                  <p>O</p>
                  <p>N</p>
                </div>
                <div className="flex justify-center items-center space-x-2 text-4xl font-poppins font-extrabold">
                  <p>D</p>
                  <p>E</p>
                  <p>V</p>
                </div>
                <div className="flex justify-center items-center space-x-2 text-4xl font-poppins font-extrabold">
                  <p>H</p>
                  <p>U</p>
                  <p>B</p>
                </div>
              </div>
              <TabGroup
                className="h-full w-full p-5"
                selectedIndex={selectedIndex}
                onChange={setSelectedIndex}
              >
                <TabList className={'h-12 flex justify-between'}>
                  <Tab
                    className={`w-full flex justify-center items-center rounded-t-lg ${
                      selectedIndex === 0
                        ? 'bg-subBackground text-primary'
                        : 'hover:bg-input hover:text-white'
                    } transition-all duration-250 ease-out`}
                  >
                    Auth & Contract Interact
                  </Tab>
                  <Tab
                    className={`w-full flex justify-center items-center rounded-t-lg ${
                      selectedIndex === 1
                        ? 'bg-subBackground text-primary'
                        : 'hover:bg-input hover:text-white'
                    } transition-all duration-250 ease-out`}
                  >
                    Bulk Mint
                  </Tab>
                </TabList>
                <TabPanels className={'h-[90%]'}>
                  <TabPanel
                    className={'h-full rounded-b-lg rounded-tr-lg bg-subBackground'}
                  >
                    {/* Web3 */}
                    <div className="grid grid-cols-2">
                      <div className="space-y-3 p-3">
                        <GetUser
                          token={token}
                          refreshToken={refreshToken}
                          provider={provider}
                          copyToken={copyToken}
                          setCopyToken={setCopyToken}
                          copyRefreshToken={copyRefreshToken}
                          setCopyRefreshToken={setCopyRefreshToken}
                        />
                        <SignOutButton
                          setAuth={setAuth}
                          firebaseApp={provider.firebaseApp}
                        />
                        <div className={`h-80 w-full flex items-center justify-center`}>
                          <div className="box">
                            <div className="loader"></div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-10 p-3">
                        <div className="space-y-3">
                          <div className="flex justify-center items-center bg-gray-300 text-black rounded-md">
                            <p>Web3 Wallet</p>
                          </div>
                          {!account ? (
                            <button
                              className="h-12 w-full p-3 rounded-lg border flex justify-center space-x-3 border-buttonBorder bg-buttonBackground text-white"
                              onClick={() => handleConnectWallet()}
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
                                  <button
                                    className="h-full w-12 justify-end"
                                    onClick={() => {
                                      navigator.clipboard.writeText(account);
                                      setCopyAddress(true);
                                      setTimeout(() => {
                                        setCopyAddress(false);
                                      }, 1000);
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={copyAddress ? faCheck : faClipboard}
                                    />
                                  </button>
                                </div>
                              </div>
                              <div className="flex justify-center items-center bg-gray-300 text-black rounded-md">
                                <p>Signature</p>
                              </div>
                              {/* Sign Signature */}
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
                                        <FontAwesomeIcon
                                          icon={copyWalletToken ? faCheck : faClipboard}
                                        />
                                      </button>
                                    </div>
                                  )}
                                  <button
                                    onClick={async () => {
                                      const signer = library.getSigner();
                                      const web3Token = await sign(
                                        async (msg) => await signer.signMessage(msg),
                                        '1d',
                                      );
                                      setWalletToken(web3Token);
                                    }}
                                    className={`h-12 ${
                                      walletToken ? 'w-1/3' : 'w-full'
                                    }  p-3 rounded-lg flex justify-center items-center space-x-3 text-black bg-primary transition-all duration-1000 ease-out`}
                                  >
                                    <FontAwesomeIcon icon={faSignature} />
                                    <p>Sign</p>
                                  </button>
                                </div>
                              )}
                              {/* Disconnect */}
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
                        {account && (
                          <div className="w-full space-y-5 rounded-lg bg-subBackground">
                            <div className="flex space-x-3">
                              <Listbox value={chain} onChange={setChain}>
                                <div className="relative w-1/2">
                                  <ListboxButton className="h-12 w-full flex justify-between items-center p-3 px-5 cursor-pointer rounded-lg border border-buttonBorder bg-subBackground">
                                    <span className="block truncate">{chain.name}</span>
                                    <FontAwesomeIcon icon={faChevronDown} />
                                  </ListboxButton>
                                  <Transition
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                  >
                                    <ListboxOptions className="absolute z-10 mt-2 w-full rounded-lg border border-buttonBorder bg-subBackground text-white shadow-[#222325] shadow-md">
                                      {chains.map((chain, index) => (
                                        <ListboxOption
                                          key={index}
                                          className={({ active }) =>
                                            `relative cursor-default select-none p-3 px-5 ${
                                              active
                                                ? 'bg-[#222325] text-white'
                                                : 'text-white'
                                            }`
                                          }
                                          value={chain}
                                        >
                                          {({ selected }) => (
                                            <>
                                              <span
                                                className={`block truncate ${
                                                  selected ? 'font-medium' : 'font-normal'
                                                }`}
                                              >
                                                {chain.name}
                                              </span>
                                              {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                  {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                                                </span>
                                              ) : null}
                                            </>
                                          )}
                                        </ListboxOption>
                                      ))}
                                    </ListboxOptions>
                                  </Transition>
                                </div>
                              </Listbox>
                              <Listbox value={operator} onChange={setOperator}>
                                <div className="relative w-1/2">
                                  <ListboxButton className="h-12 w-full flex justify-between items-center p-3 px-5 cursor-pointer rounded-lg border border-buttonBorder bg-subBackground">
                                    <span className="block truncate">
                                      {operator?.name}
                                    </span>
                                    <FontAwesomeIcon icon={faChevronDown} />
                                  </ListboxButton>
                                  <Transition
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                  >
                                    <ListboxOptions className="absolute mt-2 w-full overflow-auto rounded-lg border border-buttonBorder bg-subBackground text-white shadow-[#222325] shadow-md">
                                      {operators[chain.chainId].map((operator, index) => (
                                        <ListboxOption
                                          key={index}
                                          className={({ active }) =>
                                            `relative cursor-default select-none p-3 px-5 ${
                                              active
                                                ? 'bg-[#222325] text-white'
                                                : 'text-white'
                                            }`
                                          }
                                          value={operator}
                                        >
                                          {({ selected }) => (
                                            <>
                                              <span
                                                className={`block truncate ${
                                                  selected ? 'font-medium' : 'font-normal'
                                                }`}
                                              >
                                                {operator.name}
                                              </span>
                                              {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                  {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                                                </span>
                                              ) : null}
                                            </>
                                          )}
                                        </ListboxOption>
                                      ))}
                                    </ListboxOptions>
                                  </Transition>
                                </div>
                              </Listbox>
                            </div>
                            {/* Approval */}
                            <div className="space-y-3">
                              <div className="flex justify-center items-center bg-gray-300 text-black rounded-md">
                                <p>Approval</p>
                              </div>
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => handleApproveNFTs(true)}
                                  className={`h-12 w-full p-3 rounded-lg flex justify-center items-center space-x-3 bg-[#1d67cd] transition-all duration-1000 ease-out`}
                                >
                                  {/* <FontAwesomeIcon icon={faSignature} /> */}
                                  <p>Approve NFTs</p>
                                </button>
                                <button
                                  onClick={() => handleApproveNFTs(false)}
                                  className={`h-12 w-full p-3 rounded-lg flex justify-center items-center space-x-3 border border-[#1d67cd] transition-all duration-1000 ease-out`}
                                >
                                  {/* <FontAwesomeIcon icon={faSignature} /> */}
                                  <p>Unapprove NFTs</p>
                                </button>
                              </div>
                            </div>
                            {/* Allowance */}
                            <div className="space-y-3">
                              <div className="flex justify-center items-center bg-gray-300 text-black rounded-md">
                                <p>Allowance</p>
                              </div>
                              <div className="flex space-x-3">
                                <div className="h-12 w-full flex justify-between rounded-lg bg-[#282a36]">
                                  <div className="p-3">
                                    <input
                                      type="number"
                                      value={allowanceAmount}
                                      placeholder="Amount (Ether)"
                                      min={0}
                                      onChange={(e) => setAllowanceAmount(e.target.value)}
                                      className="w-full outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                  </div>
                                  <button
                                    onClick={() =>
                                      setAllowanceAmount(
                                        formatEther(constants.MaxUint256).toString(),
                                      )
                                    }
                                    className="p-3 bg-[#1d67cd] rounded-r-lg"
                                  >
                                    Max
                                  </button>
                                </div>
                                <button
                                  onClick={() => handleAllowanceION(true)}
                                  className={`h-12 w-full p-3 rounded-lg flex justify-center items-center space-x-3 bg-[#1d67cd] transition-all duration-1000 ease-out`}
                                >
                                  {/* <FontAwesomeIcon icon={faSignature} /> */}
                                  <p>Increase ION Allowance</p>
                                </button>
                                <button
                                  onClick={() => handleAllowanceION(false)}
                                  className={`h-12 w-full p-3 rounded-lg flex justify-center items-center space-x-3 border border-[#1d67cd] transition-all duration-1000 ease-out`}
                                >
                                  {/* <FontAwesomeIcon icon={faSignature} /> */}
                                  <p>Decrease ION Allowance</p>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel
                    className={
                      'h-full rounded-b-lg p-5 space-y-5 rounded-tl-lg bg-subBackground'
                    }
                  >
                    <button
                      onClick={bulkMintNFTs}
                      className={
                        'h-12 w-48 p-3 rounded-lg flex justify-center items-center space-x-3 text-black bg-primary transition-all duration-1000 ease-out'
                      }
                    >
                      <FontAwesomeIcon icon={faSignature} />
                      <p>Bulk Mint</p>
                    </button>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(105px,1fr))] gap-4 w-full">
                      {inventories.map((inventory, index) => (
                        <div key={index}>
                          <div className="flex justify-center items-center p-3 bg-white border border-primary rounded-lg">
                            <img
                              src={`${cdnUrls.maxi}/${inventory.itemDb.id}.png`}
                              loading="lazy"
                              alt="item"
                              className="h-20"
                            />
                          </div>
                          <p>{inventory.id}</p>
                        </div>
                      ))}
                    </div>
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </>
          ) : (
            <div className="h-full w-1/2 flex flex-col space-y-5 items-center justify-center">
              <div className="h-1/2 space-y-7 p-10 rounded-3xl bg-subBackground">
                <div className="flex items-center space-x-5">
                  <img
                    src="https://account.maxion.gg/images/icons/Vector.svg"
                    alt="maxion"
                  />
                  <span className="h-10 w-[0.5px] bg-[#272d31]"></span>
                  <h1 className="text-2xl">Maxion Account</h1>
                  <Listbox value={provider} onChange={setProvider}>
                    <div className="relative">
                      <ListboxButton className="w-56 flex justify-between items-center p-3 px-5 cursor-pointer rounded-xl border border-buttonBorder bg-subBackground">
                        <span className="block truncate">{provider.name}</span>
                        <FontAwesomeIcon icon={faChevronDown} />
                      </ListboxButton>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <ListboxOptions className="absolute mt-14 w-56 overflow-auto rounded-lg border border-buttonBorder bg-subBackground text-white shadow-[#222325] shadow-md">
                          {providers.map((provider, index) => (
                            <ListboxOption
                              key={index}
                              className={({ active }) =>
                                `relative cursor-default select-none p-3 px-5 ${
                                  active ? 'bg-[#222325] text-white' : 'text-white'
                                }`
                              }
                              value={provider}
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? 'font-medium' : 'font-normal'
                                    }`}
                                  >
                                    {provider.name}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                      {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </Transition>
                    </div>
                  </Listbox>
                </div>
                <h1 className="text-[#808080]">Continue with</h1>
                <div className="space-y-5 flex flex-col items-center">
                  <GoogleSignInButton
                    setAuth={setAuth}
                    setToken={setToken}
                    setRefreshToken={setRefreshToken}
                    firebaseApp={provider.firebaseApp}
                  />
                  <FacebookSignInButton
                    setAuth={setAuth}
                    setToken={setToken}
                    firebaseApp={provider.firebaseApp}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {(copyAddress || copyToken || copyRefreshToken || copyWalletToken) && (
          <Alert
            icon={false}
            sx={{ backgroundColor: '#282a36', color: '#FFC400' }}
            className="absolute bottom-10 right-10 bg-[#282a36] text-primary"
          >
            Copied to clipboard
          </Alert>
        )}
      </div>
    </DAppProvider>
  );
};

export default App;
