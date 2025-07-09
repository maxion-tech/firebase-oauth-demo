import { faImage, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const RefreshMetadataSection = () => {
  const [blacklistedNfts, setBlacklistedNfts] = useState([]);
  const [selectedNfts, setSelectedNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [customTokenIds, setCustomTokenIds] = useState('');
  const [refreshProgress, setRefreshProgress] = useState(0);
  const [nftImages, setNftImages] = useState({});
  const [dialog, setDialog] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  // Fetch blacklisted NFTs on component mount
  useEffect(() => {
    fetchBlacklistedNfts();
  }, []);

  // Fetch images for blacklisted NFTs when the list changes
  useEffect(() => {
    if (blacklistedNfts.length > 0) {
      fetchNftImages();
    }
  }, [blacklistedNfts]);

  const fetchBlacklistedNfts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://rolg-nft-apis.maxion.gg/nft-blacklisted');
      setBlacklistedNfts(response.data);
    } catch (error) {
      console.error('Error fetching blacklisted NFTs:', error);
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch blacklisted NFTs. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNftImages = async () => {
    const imagePromises = blacklistedNfts.map(async (nftId) => {
      try {
        const response = await axios.get(`https://rolg-nft-apis.maxion.gg/item/${nftId}`);
        return { nftId, image: response.data.image };
      } catch (error) {
        console.error(`Error fetching image for NFT ${nftId}:`, error);
        return { nftId, image: null };
      }
    });

    try {
      const results = await Promise.all(imagePromises);
      const imageMap = {};
      results.forEach(({ nftId, image }) => {
        imageMap[nftId] = image;
      });
      setNftImages(imageMap);
    } catch (error) {
      console.error('Error fetching NFT images:', error);
    }
  };

  const handleSelectNft = (tokenId) => {
    setSelectedNfts((prev) =>
      prev.includes(tokenId) ? prev.filter((id) => id !== tokenId) : [...prev, tokenId],
    );
  };

  const handleSelectAll = () => {
    if (selectedNfts.length === blacklistedNfts.length) {
      setSelectedNfts([]);
    } else {
      setSelectedNfts(blacklistedNfts.map((nftId) => nftId));
    }
  };

  const handleRefreshMetadata = async (tokenIds) => {
    // Limit to 100 NFTs per refresh
    if (tokenIds.length > 100) {
      setDialog({
        isOpen: true,
        type: 'warning',
        title: 'Too Many NFTs',
        message: `Maximum 100 NFTs can be refreshed at once. You selected ${tokenIds.length} NFTs.`,
      });
      return;
    }

    setIsRefreshing(true);
    setRefreshProgress(0);

    try {
      const apiKey = process.env.REACT_APP_SKYMAVIS_GATEWAY_API_KEY;
      if (!apiKey) {
        throw new Error('API key not found. Please check your environment variables.');
      }

      const response = await axios.post(
        `${process.env.REACT_APP_SKYMAVIS_GATEWAY_API_URL}/mavis-market-partner/collections/0xf6fe00893eea4d47f0cba303ef518fe4ab1c9dd6/refresh_metadata`,
        {
          token_ids: tokenIds.map((id) => id.toString()),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          },
        },
      );

      setRefreshProgress(100);

      setDialog({
        isOpen: true,
        type: 'success',
        title: 'Success',
        message: `Successfully refreshed metadata for ${tokenIds.length} NFTs.`,
      });

      // Refresh the blacklisted NFTs list
      setTimeout(() => {
        fetchBlacklistedNfts();
        setSelectedNfts([]);
      }, 2000);
    } catch (error) {
      console.error('Error refreshing metadata:', error);
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: `Failed to refresh metadata: ${error.response?.data || error.message}`,
      });
    } finally {
      setIsRefreshing(false);
      setRefreshProgress(0);
    }
  };

  const handleRefreshAll = () => {
    if (blacklistedNfts.length === 0) {
      setDialog({
        isOpen: true,
        type: 'warning',
        title: 'No NFTs',
        message: 'No blacklisted NFTs found to refresh.',
      });
      return;
    }

    const allTokenIds = blacklistedNfts.map((nftId) => nftId);
    handleRefreshMetadata(allTokenIds);
  };

  const handleRefreshSelected = () => {
    if (selectedNfts.length === 0) {
      setDialog({
        isOpen: true,
        type: 'warning',
        title: 'No Selection',
        message: 'Please select NFTs to refresh.',
      });
      return;
    }

    handleRefreshMetadata(selectedNfts);
  };

  const handleRefreshCustom = () => {
    const tokenIds = customTokenIds
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    if (tokenIds.length === 0) {
      setDialog({
        isOpen: true,
        type: 'warning',
        title: 'Invalid Input',
        message: 'Please enter valid token IDs separated by commas.',
      });
      return;
    }

    handleRefreshMetadata(tokenIds);
  };

  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Refresh NFT Metadata</h1>
          <p className="text-gray-400">
            Refresh metadata for blacklisted NFTs or custom token IDs (max 100 per
            refresh)
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={handleRefreshAll}
          disabled={isRefreshing || blacklistedNfts.length === 0}
          className="h-10 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRefreshing ? 'Refreshing...' : `Refresh All (${blacklistedNfts.length})`}
        </button>

        <button
          onClick={handleRefreshSelected}
          disabled={isRefreshing || selectedNfts.length === 0}
          className="h-10 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRefreshing ? 'Refreshing...' : `Refresh Selected (${selectedNfts.length})`}
        </button>
      </div>

      {/* Custom Token IDs Input */}
      <div className="bg-[#1a1b1e] rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Custom Token IDs</h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={customTokenIds}
            onChange={(e) => setCustomTokenIds(e.target.value)}
            placeholder="Enter token IDs separated by commas (e.g., 63972, 79814, 86181)"
            className="flex-1 px-4 h-10 bg-[#2a2b2e] text-white rounded-lg border border-gray-600 focus:border-primary focus:outline-none"
          />
          <button
            onClick={handleRefreshCustom}
            disabled={isRefreshing || !customTokenIds.trim()}
            className="h-10 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Custom'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {isRefreshing && (
        <div className="bg-[#1a1b1e] rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Refreshing Metadata...</span>
            <span className="text-gray-400">{refreshProgress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${refreshProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Blacklisted NFTs List */}
      <div className="flex-1 bg-[#1a1b1e] rounded-lg p-4 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Blacklisted NFTs ({blacklistedNfts.length})
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              className="text-primary hover:text-primary/80"
            >
              {selectedNfts.length === blacklistedNfts.length
                ? 'Deselect All'
                : 'Select All'}
            </button>
            <button
              onClick={fetchBlacklistedNfts}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Refresh List"
            >
              <FontAwesomeIcon
                icon={faRotateRight}
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="text-gray-400">Loading blacklisted NFTs...</div>
          </div>
        ) : blacklistedNfts.length === 0 ? (
          <div className="flex items-center justify-center flex-1">
            <div className="text-gray-400">No blacklisted NFTs found</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1">
            {blacklistedNfts.map((nftId) => (
              <div
                key={nftId}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedNfts.includes(nftId)
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-600 bg-[#2a2b2e] hover:border-gray-500'
                }`}
                onClick={() => handleSelectNft(nftId)}
              >
                <div className="flex flex-col items-center gap-2">
                  {nftImages[nftId] ? (
                    <img
                      src={nftImages[nftId]}
                      alt={`NFT ${nftId}`}
                      className="w-16 h-16 object-contain rounded bg-gray-700"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  {!nftImages[nftId] && (
                    <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center">
                      <FontAwesomeIcon icon={faImage} className="text-gray-500 text-xl" />
                    </div>
                  )}
                  <div
                    className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center"
                    style={{ display: 'none' }}
                  >
                    <FontAwesomeIcon icon={faImage} className="text-gray-500 text-xl" />
                  </div>
                  <div className="text-center">
                    <div className="text-white font-medium">{nftId}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialog */}
      {dialog.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1a1b1e] rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  dialog.type === 'success'
                    ? 'bg-green-600'
                    : dialog.type === 'error'
                    ? 'bg-red-600'
                    : dialog.type === 'warning'
                    ? 'bg-yellow-600'
                    : 'bg-blue-600'
                }`}
              >
                {dialog.type === 'success' && '✓'}
                {dialog.type === 'error' && '✕'}
                {dialog.type === 'warning' && '⚠'}
                {dialog.type === 'info' && 'ℹ'}
              </div>
              <h3 className="text-lg font-semibold text-white">{dialog.title}</h3>
            </div>
            <p className="text-gray-300 mb-6">{dialog.message}</p>
            <button
              onClick={closeDialog}
              className="w-full px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefreshMetadataSection;
