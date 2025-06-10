import { faCheck, faRotateRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { cdnUrls } from '../config';

const BulkMintSection = ({
  inventories,
  selectedItems,
  isLoading,
  loadingProgress,
  isMinting,
  mintingProgress,
  onSelectItem,
  onSelectAll,
  onBulkMint,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter inventories based on search term
  const getFilteredInventories = () => {
    if (!searchTerm.trim()) {
      return inventories;
    }

    return inventories.filter((inventory) => {
      const itemName = inventory.itemDb?.nameEnglish || '';
      const itemId = inventory.id.toString();
      const searchLower = searchTerm.toLowerCase();

      return itemName.toLowerCase().includes(searchLower) || itemId.includes(searchTerm);
    });
  };

  const filteredInventories = getFilteredInventories();

  return (
    <div className="flex flex-col h-full">
      {/* Search Input */}
      <div className="mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative w-80">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-customGrayLight"
            />
            <input
              type="text"
              placeholder="Search items by name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-10 bg-[#222324] border border-customGrayLight rounded-lg text-white placeholder-customGrayLight focus:outline-none focus:border-primary"
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
      </div>

      <div className="flex justify-start items-center space-x-6 mb-4">
        <button
          onClick={onSelectAll}
          className={`h-8 w-8 p-3 rounded-lg flex justify-center items-center space-x-3 ${
            filteredInventories.length > 0 && selectedItems.size === inventories.length
              ? 'bg-primary'
              : 'bg-[#222324] border-1 border-customGrayLight'
          } transition-all duration-100 ease-out`}
        >
          {filteredInventories.length > 0 && selectedItems.size === inventories.length ? (
            <FontAwesomeIcon icon={faCheck} color="#101010" />
          ) : null}
        </button>
        <p>Selected {selectedItems.size} items</p>

        <button
          onClick={onBulkMint}
          disabled={selectedItems.size === 0}
          className={`h-10 w-48 p-3 rounded-lg flex justify-center items-center space-x-3 ${
            selectedItems.size === 0 ? 'text-white bg-[#3f3f3f]' : 'text-black bg-primary'
          } transition-all duration-300 ease-out`}
        >
          <p>Bulk Mint</p>
        </button>

        <button
          onClick={onRefresh}
          disabled={isLoading || isMinting}
          className="h-10 w-10 p-3 rounded-lg flex justify-center items-center space-x-3 text-black bg-[#222324] transition-all duration-300 ease-out"
        >
          <FontAwesomeIcon
            icon={faRotateRight}
            color="#FFC400"
            className={`${isLoading ? 'animate-spin' : ''}`}
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

        {/* Minting Progress - Inline */}
        {isMinting && mintingProgress.total > 0 && (
          <div className="flex items-center space-x-3 ml-4">
            <span className="text-white text-sm">Minting NFTs...</span>
            <div className="flex items-center space-x-2">
              <span className="text-customGrayLight text-xs">
                {mintingProgress.current}/{mintingProgress.total}
              </span>
              <div className="w-24 bg-[#3f3f3f] rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(mintingProgress.current / mintingProgress.total) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex space-x-4 mb-4 text-sm">
        <span className="text-customGrayLight">
          Available to mint: <span className="text-white">{inventories.length}</span>
        </span>
        {searchTerm && (
          <span className="text-customGrayLight">
            Filtered results:{' '}
            <span className="text-white">{filteredInventories.length}</span>
          </span>
        )}
        {isLoading && loadingProgress.total <= 1 && (
          <span className="text-customGrayLight">
            <FontAwesomeIcon icon={faRotateRight} className="animate-spin mr-2" />
            Loading NFTs...
          </span>
        )}
        {isMinting && (
          <span className="text-customGrayLight">
            <FontAwesomeIcon icon={faRotateRight} className="animate-spin mr-2" />
            Minting NFTs...
          </span>
        )}
      </div>

      <div className="overflow-y-auto overflow-x-hidden h-[calc(100%-140px)] pr-2">
        {isLoading && inventories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-customGrayLight">
            <FontAwesomeIcon
              icon={faRotateRight}
              className="text-4xl mb-4 animate-spin"
            />
            <p className="text-xl mb-2">Loading NFTs...</p>
            <p className="text-sm">
              {loadingProgress.total > 1
                ? `Fetching page ${loadingProgress.current} of ${loadingProgress.total}`
                : 'Fetching your mint inventory'}
            </p>
          </div>
        ) : inventories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-customGrayLight">
            <p className="text-xl mb-2">No NFTs available to mint</p>
            <p className="text-sm">Your mint inventory is empty</p>
          </div>
        ) : filteredInventories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-customGrayLight">
            <p className="text-xl mb-2">No items match your search</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-4 w-full">
            {filteredInventories.map((inventory, index) => (
              <div
                key={index}
                className={`p-0.5 flex justify-center items-center bg-subBackground2 rounded-lg ${
                  selectedItems.has(inventory.id)
                    ? 'border-2 border-primary'
                    : 'border-2 border-customGrayHeavy'
                } transition-all duration-300 ease-out`}
              >
                <button
                  className="h-full w-full p-3 flex justify-center items-center bg-white rounded-md relative group"
                  onClick={() => onSelectItem(inventory.id)}
                >
                  <img
                    src={`${cdnUrls.maxi}/${inventory.itemDb.id}.png`}
                    loading="lazy"
                    alt="item"
                    className="h-20"
                    onError={(e) => {
                      e.target.src = 'https://apps.maxion.gg/images/Non-NFTs.png';
                    }}
                  />

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-primary text-black text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    {inventory.itemDb?.nameEnglish || `Item #${inventory.id}`}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></div>
                  </div>

                  <div className="absolute inset-0 px-1 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-md">
                    <div className="text-center">
                      <span className="text-white text-sm font-bold block">
                        {inventory.itemDb?.nameEnglish || `#${inventory.id}`}
                      </span>
                      <span className="text-white text-xs">{`ID: ${inventory.id}`}</span>
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

export default BulkMintSection;
