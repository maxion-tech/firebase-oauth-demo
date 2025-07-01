import { Alert } from '@mui/material';
import { BSCTestnet, DAppProvider, useConnector, useEthers } from '@usedapp/core';
import React, { useEffect, useState } from 'react';
import '../src/index.css';
import AuthSection from './components/AuthSection';
import AuthStateListener from './components/AuthStateListener';
import BulkMintSection from './components/BulkMintSection';
import ChainSelector from './components/ChainSelector';
import ConfirmDialog from './components/ConfirmDialog';
import ContractInteractions from './components/ContractInteractions';
import CustomDialog from './components/Dialog';
import LoginSection from './components/LoginSection';
import MarketplaceListingSection from './components/MarketplaceListingSection';
import Sidebar from './components/Sidebar';
import TextFormatterTab from './components/TextFormatterTab';
import WalletConnection from './components/WalletConnection';
import { chains, operators, providers } from './constants';
import { DEFAULT_SERVER } from './constants/servers';
import { useContractOperations } from './hooks/useContractOperations';
import { useInventoryOperations } from './hooks/useInventoryOperations';
import { useMarketplaceOperations } from './hooks/useMarketplaceOperations';
import {
  deleteCookie,
  getCookie,
  setCookie,
  WEB3_TOKEN_COOKIE,
} from './utils/cookieUtils';

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
  const [selectedServer, setSelectedServer] = useState(DEFAULT_SERVER);
  const [email, setEmail] = useState();

  const { account, activateBrowserWallet, deactivate, library, switchNetwork } =
    useEthers();
  const { connector } = useConnector();

  // Function to clear Web3 token on 401 error - defined before hook calls
  const clearWeb3Token = () => {
    setWalletToken(null);
    deleteCookie(WEB3_TOKEN_COOKIE);
  };

  const { handleApproveNFTs, handleAllowanceION } = useContractOperations(switchNetwork);
  const {
    inventories,
    selectedItems,
    isLoading,
    loadingProgress: inventoryLoadingProgress,
    isMinting,
    mintingProgress,
    handleBulkMint,
    handleSelectItem,
    handleSelectAll,
    getMintInventories,
    dialog: inventoryDialog,
    closeDialog: closeInventoryDialog,
    confirmDialog: inventoryConfirmDialog,
    closeConfirmDialog: closeInventoryConfirmDialog,
    cancelMintingOperation,
  } = useInventoryOperations(token, selectedServer);

  const {
    availableNfts,
    allNfts,
    selectedNfts,
    isLoading: isMarketplaceLoading,
    listingPrice,
    setListingPrice,
    loadingProgress,
    isCancelling,
    cancellingProgress,
    isListing,
    listingProgress,
    handleBulkList,
    handleSelectNft,
    handleSelectAll: handleSelectAllNfts,
    handleSelectAllListed,
    handleBulkCancel,
    handleCancelListing,
    fetchMarketplaceData,
    dialog: marketplaceDialog,
    closeDialog: closeMarketplaceDialog,
    confirmDialog: marketplaceConfirmDialog,
    closeConfirmDialog: closeMarketplaceConfirmDialog,
    cancelCancellingOperation,
    cancelListingOperation,
  } = useMarketplaceOperations(walletToken, clearWeb3Token);

  // Sign message dialog state
  const [signMessageDialog, setSignMessageDialog] = useState({
    isOpen: false,
    type: 'error',
    title: 'Sign Message Failed',
    message: 'Failed to sign Web3 message. Please try again.',
  });

  const closeSignMessageDialog = () => {
    setSignMessageDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const onApproveNFTs = (approved) => {
    handleApproveNFTs(approved, chain, operator);
  };

  const onAllowanceION = (increased) => {
    handleAllowanceION(increased, chain, operator, allowanceAmount);
  };

  // Load Web3 token from cookie on app startup
  useEffect(() => {
    const storedToken = getCookie(WEB3_TOKEN_COOKIE);
    if (storedToken) {
      setWalletToken(storedToken);
    }
  }, []);

  // Save Web3 token to cookie when it changes
  useEffect(() => {
    if (walletToken) {
      setCookie(WEB3_TOKEN_COOKIE, walletToken, 1); // Store for 1 day
    }
  }, [walletToken]);

  return (
    <DAppProvider config={config}>
      <AuthStateListener
        setAuth={setAuth}
        setToken={setToken}
        setRefreshToken={setRefreshToken}
        setProvider={setProvider}
        firebaseApp={provider.firebaseApp}
        setEmail={setEmail}
      />
      <div className="flex h-screen w-full bg-subBackground2 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          isAuthenticated={auth}
          email={email}
        />
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full min-h-0">
          {/* Main Content */}
          <div className="flex-1 flex flex-col text-white p-6 min-h-0 min-w-0 h-full">
            {auth ? (
              <div className="w-full h-full flex flex-col gap-8">
                {selectedIndex === 0 && (
                  <div className="flex items-center justify-center h-full w-full">
                    <div className="h-full w-full flex items-center justify-center bg-subBackground rounded-lg shadow-lg p-6">
                      <AuthSection
                        token={token}
                        refreshToken={refreshToken}
                        provider={provider}
                        copyToken={copyToken}
                        setCopyToken={setCopyToken}
                        copyRefreshToken={copyRefreshToken}
                        setCopyRefreshToken={setCopyRefreshToken}
                        setAuth={setAuth}
                        email={email}
                      />
                    </div>
                  </div>
                )}
                {selectedIndex === 1 && (
                  <div className="flex items-center justify-center h-full w-full">
                    <div className="h-full w-full flex flex-col items-center bg-subBackground rounded-lg shadow-lg p-6">
                      <WalletConnection
                        account={account}
                        activateBrowserWallet={activateBrowserWallet}
                        deactivate={deactivate}
                        library={library}
                        connector={connector}
                        copyAddress={copyAddress}
                        setCopyAddress={setCopyAddress}
                        walletToken={walletToken}
                        setWalletToken={setWalletToken}
                        copyWalletToken={copyWalletToken}
                        setCopyWalletToken={setCopyWalletToken}
                      />
                      {account && (
                        <div className="w-full space-y-5 mt-6">
                          <ChainSelector
                            chain={chain}
                            setChain={setChain}
                            chains={chains}
                            operator={operator}
                            setOperator={setOperator}
                            operators={operators}
                          />
                          <ContractInteractions
                            operator={operator}
                            allowanceAmount={allowanceAmount}
                            setAllowanceAmount={setAllowanceAmount}
                            onApproveNFTs={onApproveNFTs}
                            onAllowanceION={onAllowanceION}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {selectedIndex === 2 && (
                  <div className="rounded-lg bg-subBackground p-6 shadow-md h-full">
                    <BulkMintSection
                      inventories={inventories}
                      selectedItems={selectedItems}
                      isLoading={isLoading}
                      loadingProgress={inventoryLoadingProgress}
                      isMinting={isMinting}
                      mintingProgress={mintingProgress}
                      onSelectItem={handleSelectItem}
                      onSelectAll={handleSelectAll}
                      onBulkMint={handleBulkMint}
                      onRefresh={getMintInventories}
                      onCancelMintingOperation={cancelMintingOperation}
                      selectedServer={selectedServer}
                      onServerChange={setSelectedServer}
                    />
                  </div>
                )}
                {selectedIndex === 3 && (
                  <div className="rounded-lg bg-subBackground p-6 shadow-md h-full">
                    <MarketplaceListingSection
                      availableNfts={availableNfts}
                      allNfts={allNfts}
                      selectedNfts={selectedNfts}
                      isLoading={isMarketplaceLoading}
                      listingPrice={listingPrice}
                      setListingPrice={setListingPrice}
                      onSelectNft={handleSelectNft}
                      onSelectAll={handleSelectAllNfts}
                      onBulkList={handleBulkList}
                      onSelectAllListed={handleSelectAllListed}
                      onBulkCancel={handleBulkCancel}
                      onCancelListing={handleCancelListing}
                      onRefresh={fetchMarketplaceData}
                      loadingProgress={loadingProgress}
                      isCancelling={isCancelling}
                      cancellingProgress={cancellingProgress}
                      onCancelCancellingOperation={cancelCancellingOperation}
                      isListing={isListing}
                      listingProgress={listingProgress}
                      onCancelListingOperation={cancelListingOperation}
                      walletToken={walletToken}
                      account={account}
                      onConnectWallet={activateBrowserWallet}
                      onSignMessage={async () => {
                        if (library && connector) {
                          try {
                            const signer = library.getSigner();
                            const { sign } = await import('web3-token');
                            const web3Token = await sign(
                              async (msg) => await signer.signMessage(msg),
                              '1d',
                            );
                            setWalletToken(web3Token);
                            console.log('Web3 token signed and saved to cookies');
                          } catch (error) {
                            console.error('Failed to sign message:', error);
                            setSignMessageDialog({
                              isOpen: true,
                              type: 'error',
                              title: 'Sign Message Failed',
                              message: 'Failed to sign Web3 message. Please try again.',
                            });
                          }
                        }
                      }}
                    />
                  </div>
                )}
                {selectedIndex === 4 && (
                  <div className="rounded-lg bg-subBackground p-6 shadow-md h-full">
                    <TextFormatterTab mode="delimiters" />
                  </div>
                )}
                {selectedIndex === 5 && (
                  <div className="rounded-lg bg-subBackground p-6 shadow-md h-full">
                    <TextFormatterTab mode="json" />
                  </div>
                )}
                {selectedIndex === 6 && (
                  <div className="rounded-lg bg-subBackground p-6 shadow-md h-full">
                    <TextFormatterTab mode="env" />
                  </div>
                )}
              </div>
            ) : (
              <LoginSection
                provider={provider}
                setProvider={setProvider}
                providers={providers}
                setAuth={setAuth}
                setToken={setToken}
                setRefreshToken={setRefreshToken}
                setEmail={setEmail}
              />
            )}
          </div>
        </div>
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

      {/* Dialog Components */}
      <CustomDialog
        isOpen={inventoryDialog.isOpen}
        onClose={closeInventoryDialog}
        title={inventoryDialog.title}
        message={inventoryDialog.message}
        type={inventoryDialog.type}
        onConfirm={inventoryDialog.onConfirm}
      />

      <ConfirmDialog
        isOpen={inventoryConfirmDialog.isOpen}
        onClose={closeInventoryConfirmDialog}
        title={inventoryConfirmDialog.title}
        message={inventoryConfirmDialog.message}
        type={inventoryConfirmDialog.type}
        onConfirm={inventoryConfirmDialog.onConfirm}
      />

      <CustomDialog
        isOpen={marketplaceDialog.isOpen}
        onClose={closeMarketplaceDialog}
        title={marketplaceDialog.title}
        message={marketplaceDialog.message}
        type={marketplaceDialog.type}
        onConfirm={marketplaceDialog.onConfirm}
      />

      <ConfirmDialog
        isOpen={marketplaceConfirmDialog.isOpen}
        onClose={closeMarketplaceConfirmDialog}
        title={marketplaceConfirmDialog.title}
        message={marketplaceConfirmDialog.message}
        type={marketplaceConfirmDialog.type}
        onConfirm={marketplaceConfirmDialog.onConfirm}
      />

      <CustomDialog
        isOpen={signMessageDialog.isOpen}
        onClose={closeSignMessageDialog}
        title={signMessageDialog.title}
        message={signMessageDialog.message}
        type={signMessageDialog.type}
      />
    </DAppProvider>
  );
};

export default App;
