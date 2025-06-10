import {
  faCheck,
  faDollarSign,
  faExclamationTriangle,
  faRotateRight,
  faSearch,
  faSignature,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { cdnUrls } from '../config';

const SignRequirement = ({ account, onConnectWallet, onSignMessage, isConnecting }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <div className="text-center space-y-4">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="text-6xl text-yellow-500 mb-4"
        />
        <h2 className="text-2xl font-bold text-white">Web3 Signature Required</h2>
        <p className="text-customGrayLight max-w-md">
          To access the marketplace listing features, you need to connect your wallet and
          sign a message to verify ownership.
        </p>
      </div>

      <div className="space-y-4 w-full max-w-md">
        {!account ? (
          <button
            className="h-12 w-full p-3 rounded-lg border flex justify-center space-x-3 border-buttonBorder bg-buttonBackground text-white hover:bg-opacity-80 transition-all"
            onClick={onConnectWallet}
            disabled={isConnecting}
          >
            <img
              src="https://account.maxion.gg/images/icons/Metamask.svg"
              alt="metamask"
              className="h-5"
            />
            <p>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</p>
          </button>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm">✓ Wallet Connected</p>
              <p className="text-customGrayLight text-xs truncate">{account}</p>
            </div>
            <button
              onClick={onSignMessage}
              className="h-12 w-full p-3 rounded-lg flex justify-center items-center space-x-3 text-black bg-primary hover:bg-opacity-90 transition-all"
            >
              <FontAwesomeIcon icon={faSignature} />
              <p>Sign Message</p>
            </button>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-customGrayLight max-w-lg">
        <p>
          This signature is required to authenticate your wallet for marketplace
          operations. No fees will be charged for signing.
        </p>
      </div>
    </div>
  );
};

const MarketplaceListingSection = ({
  availableNfts,
  allNfts,
  selectedNfts,
  isLoading,
  listingPrice,
  setListingPrice,
  onSelectNft,
  onSelectAll,
  onSelectAllListed,
  onBulkList,
  onBulkCancel,
  onCancelListing,
  onRefresh,
  loadingProgress,
  isCancelling,
  cancellingProgress,
  onCancelCancellingOperation,
  isListing,
  listingProgress,
  onCancelListingOperation,
  // Web3 authentication props
  walletToken,
  account,
  onConnectWallet,
  onSignMessage,
}) => {
  const [filter, setFilter] = useState('all'); // 'all', 'available', 'listed'
  const [searchTerm, setSearchTerm] = useState('');

  // If no wallet token, show sign requirement
  if (!walletToken) {
    return (
      <SignRequirement
        account={account}
        onConnectWallet={onConnectWallet}
        onSignMessage={onSignMessage}
        isConnecting={false}
      />
    );
  }

  // Filter NFTs based on current filter and search term
  const getFilteredNfts = () => {
    let filtered = allNfts;

    // Apply status filter first
    switch (filter) {
      case 'available':
        filtered = allNfts.filter((nft) => !nft.isListed);
        break;
      case 'listed':
        filtered = allNfts.filter((nft) => nft.isListed);
        break;
      case 'all':
      default:
        filtered = allNfts;
        break;
    }

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter((nft) => {
        const nftName = nft.nft?.nameEnglish;
        return nftName.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    return filtered;
  };

  const filteredNfts = getFilteredNfts();
  const listedCount = allNfts.filter((nft) => nft.isListed).length;
  const isListingLimitReached = listedCount >= 50;
  const maxCanList = Math.max(0, 50 - listedCount);
  const selectableCount = Math.min(availableNfts.length, maxCanList);

  // Get current selection context
  const listedNfts = allNfts.filter((nft) => nft.isListed);
  const selectedListedNfts = allNfts.filter(
    (nft) => nft.isListed && selectedNfts.has(nft.id),
  );

  // Determine which select all function to use
  const handleSelectAllClick = () => {
    if (filter === 'listed') {
      onSelectAllListed();
    } else {
      onSelectAll();
    }
  };

  // Determine select all button state
  const getSelectAllState = () => {
    if (filter === 'listed') {
      return {
        isSelected: selectedNfts.size === listedNfts.length,
        isDisabled: listedNfts.length === 0,
        tooltip: listedNfts.length === 0 ? 'No listed NFTs to select' : '',
      };
    } else {
      return {
        isSelected: selectableCount > 0 && selectedNfts.size === selectableCount,
        isDisabled: selectableCount === 0,
        tooltip: selectableCount === 0 ? 'No NFTs available to list (limit reached)' : '',
      };
    }
  };

  const selectAllState = getSelectAllState();

  // Normal marketplace listing UI
  return (
    <div className="flex flex-col h-full">
      {/* Filter and Search Section */}
      <div className="flex items-center space-x-6 mb-4">
        {/* Search Input */}
        <div className="flex items-center space-x-3">
          <div className="relative w-80">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-customGrayLight"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search NFTs by name"
              className="w-full h-10 pl-10 pr-4 bg-[#222324] border border-customGrayLight rounded-lg text-white placeholder-customGrayLight focus:outline-none focus:border-primary"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-customGrayLight hover:text-white transition-colors"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-3">
          {/* <FontAwesomeIcon icon={faFilter} className="text-customGrayLight" />
          <span className="text-customGrayLight text-sm">Filter:</span> */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`h-10 px-4 py-2 rounded-lg text-sm transition-all ${
                filter === 'all'
                  ? 'bg-primary text-black'
                  : 'bg-[#222324] text-customGrayLight hover:bg-[#3f3f3f] hover:text-white'
              }`}
            >
              All ({allNfts.length})
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`h-10 px-4 py-2 rounded-lg text-sm transition-all ${
                filter === 'available'
                  ? 'bg-green-600 text-white'
                  : 'bg-[#222324] text-customGrayLight hover:bg-[#3f3f3f] hover:text-white'
              }`}
            >
              Available ({availableNfts.length})
            </button>
            <button
              onClick={() => setFilter('listed')}
              className={`h-10 px-4 py-2 rounded-lg text-sm transition-all ${
                filter === 'listed'
                  ? 'bg-red-600 text-white'
                  : 'bg-[#222324] text-customGrayLight hover:bg-[#3f3f3f] hover:text-white'
              }`}
            >
              Listed ({listedCount})
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-start items-center space-x-5 mb-5">
        <button
          onClick={handleSelectAllClick}
          disabled={selectAllState.isDisabled}
          className={`h-8 w-8 p-3 rounded-lg flex justify-center items-center space-x-3 ${
            selectAllState.isSelected
              ? 'bg-primary'
              : selectAllState.isDisabled
              ? 'bg-[#3f3f3f] cursor-not-allowed'
              : 'bg-[#222324] border-1 border-customGrayLight hover:bg-[#3f3f3f]'
          } transition-all duration-100 ease-out`}
          title={selectAllState.tooltip}
        >
          {selectAllState.isSelected ? (
            <FontAwesomeIcon icon={faCheck} color="#101010" />
          ) : null}
        </button>
        <p>Selected {selectedNfts.size} NFTs</p>

        {/* Price Input */}
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faDollarSign} className="text-primary" />
          <input
            type="number"
            value={listingPrice}
            onChange={(e) => {
              const value = e.target.value;
              // Only allow integers (no decimal points)
              if (value === '' || /^\d+$/.test(value)) {
                setListingPrice(value);
              }
            }}
            placeholder="Price per NFT"
            min="3"
            step="1"
            className="h-10 w-40 p-2 rounded-lg bg-[#222324] text-white outline-none border border-customGrayLight focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div className="flex space-x-3">
          {filter !== 'listed' && (
            <button
              onClick={onBulkList}
              disabled={
                selectedNfts.size === 0 ||
                isLoading ||
                isCancelling ||
                isListing ||
                !listingPrice ||
                parseInt(listingPrice) < 3 ||
                isListingLimitReached
              }
              className={`h-10 w-48 p-3 rounded-lg flex justify-center items-center space-x-3 ${
                selectedNfts.size === 0 ||
                isLoading ||
                isCancelling ||
                isListing ||
                !listingPrice ||
                parseInt(listingPrice) < 3 ||
                isListingLimitReached
                  ? 'text-white bg-[#3f3f3f]'
                  : 'text-black bg-primary'
              }`}
            >
              Bulk List
            </button>
          )}

          {filter === 'listed' && (
            <button
              onClick={onBulkCancel}
              disabled={
                selectedListedNfts.length === 0 || isLoading || isCancelling || isListing
              }
              className={`h-10 w-48 p-3 rounded-lg flex justify-center items-center space-x-3 ${
                selectedListedNfts.length === 0 || isLoading || isCancelling || isListing
                  ? 'text-white bg-[#3f3f3f]'
                  : 'text-black bg-primary'
              }`}
            >
              Bulk Cancel Listing
            </button>
          )}
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading || isCancelling || isListing}
          className="h-10 w-10 p-3 rounded-lg flex justify-center items-center space-x-3 text-black bg-[#222324] transition-all duration-300 ease-out"
        >
          <FontAwesomeIcon
            icon={faRotateRight}
            color="#FFC400"
            className={`${isLoading || isCancelling || isListing ? 'animate-spin' : ''}`}
          />
        </button>

        {/* Loading Progress - Inline */}
        {isLoading && loadingProgress.total > 1 && (
          <div className="flex items-center space-x-3 ml-4">
            <span className="text-white text-sm">Loading NFTs...</span>
            <div className="flex items-center space-x-2">
              <span className="text-customGrayLight text-xs">
                {loadingProgress.current}/{loadingProgress.total}
              </span>
              <div className="w-24 bg-[#3f3f3f] rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(loadingProgress.current / loadingProgress.total) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Cancelling Progress - Inline */}
        {isCancelling && cancellingProgress.total > 0 && (
          <div className="flex items-center space-x-3 ml-4">
            <span className="text-white text-sm">Cancelling Listings...</span>
            <div className="flex items-center space-x-2">
              <span className="text-customGrayLight text-xs">
                {cancellingProgress.current}/{cancellingProgress.total}
              </span>
              <div className="w-24 bg-[#3f3f3f] rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (cancellingProgress.current / cancellingProgress.total) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <button
                onClick={onCancelCancellingOperation}
                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                title="Cancel operation"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Listing Progress - Inline */}
        {isListing && listingProgress.total > 0 && (
          <div className="flex items-center space-x-3 ml-4">
            <span className="text-white text-sm">Listing NFTs...</span>
            <div className="flex items-center space-x-2">
              <span className="text-customGrayLight text-xs">
                {listingProgress.current}/{listingProgress.total}
              </span>
              <div className="w-24 bg-[#3f3f3f] rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(listingProgress.current / listingProgress.total) * 100}%`,
                  }}
                ></div>
              </div>
              <button
                onClick={onCancelListingOperation}
                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                title="Cancel operation"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex space-x-4 mb-4 text-sm">
        <span className="text-customGrayLight">
          Available to list: <span className="text-white">{availableNfts.length}</span>
        </span>
        <span className="text-customGrayLight">
          Currently listed:{' '}
          <span
            className={`${
              isListingLimitReached ? 'text-red-400 font-bold' : 'text-red-400'
            }`}
          >
            {listedCount}/50
          </span>
        </span>
        {isListingLimitReached && (
          <span className="text-red-400 text-sm font-bold">
            ⚠️ Maximum listing limit reached
          </span>
        )}
        {listingPrice && selectedNfts.size > 0 && !isListingLimitReached && (
          <span className="text-customGrayLight">
            Total value:{' '}
            <span className="text-primary">
              ${parseInt(listingPrice) * selectedNfts.size}
            </span>
          </span>
        )}
        {isLoading && loadingProgress.total <= 1 && (
          <span className="text-customGrayLight">
            <FontAwesomeIcon icon={faRotateRight} className="animate-spin mr-2" />
            Loading NFTs...
          </span>
        )}
        {isCancelling && (
          <span className="text-customGrayLight">
            <FontAwesomeIcon icon={faRotateRight} className="animate-spin mr-2" />
            Cancelling Listings...
          </span>
        )}
        {isListing && (
          <span className="text-customGrayLight">
            <FontAwesomeIcon icon={faRotateRight} className="animate-spin mr-2" />
            Listing NFTs...
          </span>
        )}
      </div>

      <div className="overflow-y-auto overflow-x-hidden h-[calc(100%-100px)] pr-2">
        {isLoading && allNfts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-customGrayLight">
            <FontAwesomeIcon
              icon={faRotateRight}
              className="text-4xl mb-4 animate-spin"
            />
            <p className="text-xl mb-2">Loading NFTs...</p>
            <p className="text-sm">
              {loadingProgress.total > 1
                ? `Fetching page ${loadingProgress.current} of ${loadingProgress.total}`
                : 'Fetching your wallet NFTs'}
            </p>
          </div>
        ) : filteredNfts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-customGrayLight">
            {searchTerm ? (
              <>
                <p className="text-xl mb-2">No NFTs found</p>
                <p className="text-sm">
                  No NFTs match "{searchTerm}" in the{' '}
                  {filter === 'all' ? 'current' : filter} collection
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-4 py-2 bg-primary text-black rounded-lg hover:bg-opacity-80 transition-all"
                >
                  Clear Search
                </button>
              </>
            ) : filter !== 'all' ? (
              <>
                <p className="text-xl mb-2">No {filter} NFTs</p>
                <p className="text-sm">
                  {filter === 'available'
                    ? 'All your NFTs are currently listed on the marketplace'
                    : 'You have no NFTs listed on the marketplace'}
                </p>
                <button
                  onClick={() => setFilter('all')}
                  className="mt-4 px-4 py-2 bg-primary text-black rounded-lg hover:bg-opacity-80 transition-all"
                >
                  Show All NFTs
                </button>
              </>
            ) : (
              <>
                <p className="text-xl mb-2">No NFTs found</p>
                <p className="text-sm">Your wallet doesn't contain any NFTs</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-4 w-full">
            {filteredNfts.map((nft, index) => (
              <div
                key={nft.id || index}
                className={`p-0.5 flex justify-center items-center bg-subBackground2 rounded-lg ${
                  nft.isListed
                    ? 'border-2 border-red-500'
                    : selectedNfts.has(nft.id)
                    ? 'border-2 border-primary'
                    : 'border-2 border-customGrayHeavy'
                } transition-all duration-300 ease-out`}
              >
                <button
                  className="h-full w-full p-3 flex justify-center items-center bg-white rounded-md relative group"
                  onClick={() => {
                    if (nft.isListed) {
                      onCancelListing(nft);
                    } else {
                      onSelectNft(nft.id);
                    }
                  }}
                  title={nft.name || `NFT #${nft.id}`}
                >
                  <img
                    src={`${cdnUrls.maxi}/${nft.nft.nameid}.png`}
                    loading="lazy"
                    alt={nft.name || 'NFT'}
                    className="h-20"
                    onError={(e) => {
                      e.target.src = 'https://apps.maxion.gg/images/Non-NFTs.png';
                    }}
                  />

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-primary text-black text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    {nft.nft.nameEnglish || `NFT #${nft.id}`}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></div>
                  </div>

                  {/* Listed Banner */}
                  {nft.isListed && (
                    <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-t-md text-center">
                      LISTED - {nft.listing?.price || 'N/A'} ION
                    </div>
                  )}

                  <div className="absolute inset-0 px-1 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-md">
                    <div className="text-center">
                      <span className="text-white text-sm font-bold block">
                        {nft.isListed
                          ? 'Click to Cancel'
                          : nft.nft.nameEnglish || `#${nft.id}`}
                      </span>
                      <span className="text-white text-xs">
                        {nft.isListed ? 'Cancel Listing' : `ID: ${nft.id}`}
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceListingSection;
