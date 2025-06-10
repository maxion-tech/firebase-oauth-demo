import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { marketplaceApiUrls } from '../config';

export const useMarketplaceOperations = (walletToken, clearWeb3Token) => {
  const [walletNfts, setWalletNfts] = useState([]);
  const [currentListings, setCurrentListings] = useState([]);
  const [availableNfts, setAvailableNfts] = useState([]);
  const [allNfts, setAllNfts] = useState([]);
  const [selectedNfts, setSelectedNfts] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [listingPrice, setListingPrice] = useState('');
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0 });

  // Bulk operations progress states
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellingProgress, setCancellingProgress] = useState({ current: 0, total: 0 });
  const [isListing, setIsListing] = useState(false);
  const [listingProgress, setListingProgress] = useState({ current: 0, total: 0 });
  const cancelRef = useRef(false);
  const cancelListingRef = useRef(false);

  // Dialog states
  const [dialog, setDialog] = useState({
    isOpen: false,
    type: 'info', // 'success', 'error', 'warning', 'info'
    title: '',
    message: '',
    onConfirm: null,
  });

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'warning',
  });

  // Helper functions for dialogs
  const showDialog = (type, title, message, onConfirm = null) => {
    setDialog({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
    });
  };

  const showConfirmDialog = (title, message, onConfirm, type = 'warning') => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
      type,
    });
  };

  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const closeConfirmDialog = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  // Cancel operations
  const cancelCancellingOperation = () => {
    cancelRef.current = true;
  };

  const cancelListingOperation = () => {
    cancelListingRef.current = true;
  };

  const resetCancelState = () => {
    cancelRef.current = false;
  };

  const resetListingCancelState = () => {
    cancelListingRef.current = false;
  };

  // Handle 401 errors and clear token
  const handleApiError = (error) => {
    if (error.response?.status === 401) {
      console.log('401 error detected, clearing Web3 token');
      if (clearWeb3Token) {
        clearWeb3Token();
      }
      return true; // Indicates 401 error was handled
    }
    return false; // Other errors
  };

  const fetchWalletNfts = async () => {
    if (!walletToken) return [];

    try {
      let allNfts = [];
      let currentPage = 1;
      let totalPages = 1;
      const limit = 200; // Maximum per request

      setLoadingProgress({ current: 0, total: 1 });

      // Fetch first page to get total pages
      const firstPageResponse = await axios.get(`${marketplaceApiUrls.maxi}/nft/wallet`, {
        headers: {
          Authorization: `Bearer ${walletToken}`,
        },
        params: {
          limit,
          page: currentPage,
          isMaxiWallet: false,
          chain: 'maxi-testnet',
        },
      });

      const firstPageData = firstPageResponse.data;

      if (firstPageData && firstPageData.data) {
        allNfts = [...firstPageData.data];
        totalPages = firstPageData.totalPages || 1;

        setLoadingProgress({ current: 1, total: totalPages });

        // If there are more pages, fetch them
        if (totalPages > 1) {
          for (let page = 2; page <= totalPages; page++) {
            try {
              const response = await axios.get(`${marketplaceApiUrls.maxi}/nft/wallet`, {
                headers: {
                  Authorization: `Bearer ${walletToken}`,
                },
                params: {
                  limit,
                  page,
                  isMaxiWallet: false,
                  chain: 'maxi-testnet',
                },
              });

              if (response.data && response.data.data) {
                allNfts = [...allNfts, ...response.data.data];
              }

              setLoadingProgress({ current: page, total: totalPages });

              // Small delay to prevent overwhelming the server
              await new Promise((resolve) => setTimeout(resolve, 100));
            } catch (pageError) {
              console.error(`Error fetching page ${page}:`, pageError);
              if (handleApiError(pageError)) {
                return []; // Stop fetching on 401
              }
              // Continue with other pages even if one fails
            }
          }
        }
      }

      setLoadingProgress({ current: 0, total: 0 });
      return allNfts;
    } catch (error) {
      console.error('Error fetching wallet NFTs:', error);
      setLoadingProgress({ current: 0, total: 0 });
      if (handleApiError(error)) {
        return []; // Return empty on 401
      }
      return [];
    }
  };

  const fetchCurrentListings = async () => {
    if (!walletToken) return [];
    try {
      const response = await axios.get(
        `${marketplaceApiUrls.maxi}/market/my-market-list`,
        {
          headers: {
            Authorization: `Bearer ${walletToken}`,
          },
          params: {
            status: 'LISTING',
          },
        },
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching current listings:', error);
      if (handleApiError(error)) {
        return []; // Return empty on 401
      }
      return [];
    }
  };

  const fetchMarketplaceData = async () => {
    if (!walletToken) {
      setWalletNfts([]);
      setCurrentListings([]);
      setAvailableNfts([]);
      setAllNfts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [nfts, listings] = await Promise.all([
        fetchWalletNfts(),
        fetchCurrentListings(),
      ]);

      setWalletNfts(nfts);
      setCurrentListings(listings);

      // Create a map of listed NFTs for easy lookup
      const listingsByNftId = new Map();
      listings.forEach((listing) => {
        const nftId = listing.nft?.id || listing.nftId;
        if (nftId) {
          listingsByNftId.set(nftId, listing);
        }
      });

      // Filter out already listed NFTs for available list
      const listedNftIds = new Set(listingsByNftId.keys());
      const available = nfts.filter((nft) => !listedNftIds.has(nft.id));
      setAvailableNfts(available);

      // Combine all NFTs with listing status
      const combined = nfts.map((nft) => ({
        ...nft,
        isListed: listedNftIds.has(nft.id),
        listing: listingsByNftId.get(nft.id) || null,
      }));
      setAllNfts(combined);
    } catch (error) {
      console.error('Error fetching marketplace data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const listNftToMarketplace = async (nftId, price) => {
    try {
      await axios.post(
        `${marketplaceApiUrls.maxi}/market/sell`,
        { nftId: nftId, price: parseFloat(price) },
        {
          headers: {
            Authorization: `Bearer ${walletToken}`,
          },
        },
      );
      return true;
    } catch (error) {
      console.error(`Error listing NFT ${nftId}:`, error);
      if (handleApiError(error)) {
        return false; // Return false on 401
      }
      return false;
    }
  };

  const cancelListing = async (marketId) => {
    try {
      await axios.post(
        `${marketplaceApiUrls.maxi}/market/cancel`,
        { marketId },
        {
          headers: {
            Authorization: `Bearer ${walletToken}`,
          },
        },
      );
      return true;
    } catch (error) {
      console.error(`Error canceling listing ${marketId}:`, error);
      if (handleApiError(error)) {
        return false; // Return false on 401
      }
      return false;
    }
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleBulkList = async () => {
    if (!listingPrice || selectedNfts.size === 0) {
      showDialog(
        'warning',
        'Invalid Selection',
        'Please set a price and select NFTs to list',
      );
      return;
    }

    if (!walletToken) {
      showDialog('warning', 'Authentication Required', 'Please sign Web3 message first');
      return;
    }

    showConfirmDialog(
      'Confirm Bulk Listing',
      `Are you sure you want to list ${selectedNfts.size} NFTs at ${listingPrice} each?`,
      async () => {
        setIsListing(true);
        resetListingCancelState();
        let successCount = 0;
        let failCount = 0;
        let processedCount = 0;
        const totalItems = selectedNfts.size;

        setListingProgress({ current: 0, total: totalItems });

        for (const nftId of selectedNfts) {
          // Check if operation was cancelled
          if (cancelListingRef.current) {
            break;
          }

          // Check if token was cleared due to 401
          if (!walletToken) {
            showDialog(
              'error',
              'Session Expired',
              'Your session has expired. Please sign the Web3 message again.',
            );
            break;
          }

          try {
            setListingProgress({ current: processedCount + 1, total: totalItems });

            const success = await listNftToMarketplace(nftId, listingPrice);
            if (success) {
              successCount++;
            } else {
              failCount++;
            }
            processedCount++;
            await sleep(1000); // Wait 1 second between requests
          } catch (error) {
            console.error(`Failed to list NFT ${nftId}:`, error);
            failCount++;
            processedCount++;
            await sleep(2000); // Wait longer on error
          }
        }

        const operationMessage = cancelListingRef.current
          ? `Listing cancelled! Processed: ${processedCount}/${totalItems}, Success: ${successCount}, Failed: ${failCount}`
          : `Listing complete! Success: ${successCount}, Failed: ${failCount}`;

        showDialog(
          cancelListingRef.current
            ? 'warning'
            : successCount > 0 && failCount === 0
            ? 'success'
            : failCount > 0
            ? 'warning'
            : 'info',
          cancelListingRef.current ? 'Listing Cancelled' : 'Listing Complete',
          operationMessage,
        );
        setSelectedNfts(new Set());
        setListingPrice('');
        await fetchMarketplaceData(); // Refresh data
        setIsListing(false);
        setListingProgress({ current: 0, total: 0 });
        resetListingCancelState();
      },
    );
  };

  const handleSelectNft = (nftId) => {
    setSelectedNfts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nftId)) {
        newSet.delete(nftId);
      } else {
        newSet.add(nftId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const listedCount = allNfts.filter((nft) => nft.isListed).length;
    const maxCanList = Math.max(0, 50 - listedCount);

    if (selectedNfts.size === Math.min(availableNfts.length, maxCanList)) {
      // If all selectable NFTs are selected, deselect all
      setSelectedNfts(new Set());
    } else {
      // Select only the NFTs that can be listed without exceeding limit
      const selectableNfts = availableNfts.slice(0, maxCanList);
      const allIds = selectableNfts.map((nft) => nft.id);
      setSelectedNfts(new Set(allIds));

      // Show dialog if we're limiting selection due to listing limit
      if (maxCanList < availableNfts.length) {
        showDialog(
          'warning',
          'Selection Limited',
          `Only selected ${maxCanList} NFTs to stay within the 50 listing limit. You currently have ${listedCount} NFTs listed.`,
        );
      }
    }
  };

  const handleSelectAllListed = () => {
    const listedNfts = allNfts.filter((nft) => nft.isListed);

    if (selectedNfts.size === listedNfts.length) {
      // If all listed NFTs are selected, deselect all
      setSelectedNfts(new Set());
    } else {
      // Select all listed NFTs
      const allIds = listedNfts.map((nft) => nft.id);
      setSelectedNfts(new Set(allIds));
    }
  };

  const handleBulkCancel = async () => {
    if (selectedNfts.size === 0) {
      showDialog('warning', 'No Selection', 'Please select NFTs to cancel listing');
      return;
    }

    if (!walletToken) {
      showDialog('warning', 'Authentication Required', 'Please sign Web3 message first');
      return;
    }

    // Get selected listed NFTs
    const selectedListedNfts = allNfts.filter(
      (nft) => nft.isListed && selectedNfts.has(nft.id),
    );

    if (selectedListedNfts.length === 0) {
      showDialog('warning', 'Invalid Selection', 'Please select listed NFTs to cancel');
      return;
    }

    showConfirmDialog(
      'Confirm Bulk Cancel',
      `Are you sure you want to cancel ${selectedListedNfts.length} listings?`,
      async () => {
        setIsCancelling(true);
        resetCancelState();
        let successCount = 0;
        let failCount = 0;
        let processedCount = 0;
        const totalItems = selectedListedNfts.length;

        setCancellingProgress({ current: 0, total: totalItems });

        for (const nft of selectedListedNfts) {
          // Check if operation was cancelled
          if (cancelRef.current) {
            break;
          }

          // Check if token was cleared due to 401
          if (!walletToken) {
            showDialog(
              'error',
              'Session Expired',
              'Your session has expired. Please sign the Web3 message again.',
            );
            break;
          }

          try {
            setCancellingProgress({ current: processedCount + 1, total: totalItems });

            const success = await cancelListing(nft.listing.id);
            if (success) {
              successCount++;
            } else {
              failCount++;
            }
            processedCount++;
            await sleep(1000); // Wait 1 second between requests
          } catch (error) {
            console.error(`Failed to cancel listing for NFT ${nft.id}:`, error);
            failCount++;
            processedCount++;
            await sleep(2000); // Wait longer on error
          }
        }

        const operationMessage = cancelRef.current
          ? `Cancelling cancelled! Processed: ${processedCount}/${totalItems}, Success: ${successCount}, Failed: ${failCount}`
          : `Cancel complete! Success: ${successCount}, Failed: ${failCount}`;

        showDialog(
          cancelRef.current
            ? 'warning'
            : successCount > 0 && failCount === 0
            ? 'success'
            : failCount > 0
            ? 'warning'
            : 'info',
          cancelRef.current ? 'Cancelling Cancelled' : 'Cancel Complete',
          operationMessage,
        );
        setSelectedNfts(new Set());
        await fetchMarketplaceData(); // Refresh data
        setIsCancelling(false);
        setCancellingProgress({ current: 0, total: 0 });
        resetCancelState();
      },
      'danger',
    );
  };

  const handleCancelListing = async (nft) => {
    if (!nft.listing?.id) {
      showDialog('error', 'Listing Not Found', 'No listing found for this NFT');
      return;
    }

    if (!walletToken) {
      showDialog('warning', 'Authentication Required', 'Please sign Web3 message first');
      return;
    }

    showConfirmDialog(
      'Cancel Listing',
      `Are you sure you want to cancel the listing for ${
        nft.nft?.nameEnglish || `NFT #${nft.id}`
      }?`,
      async () => {
        setIsLoading(true);
        try {
          const success = await cancelListing(nft.listing.id);
          if (success) {
            showDialog('success', 'Success', 'Listing canceled successfully!');
            await fetchMarketplaceData(); // Refresh data
          } else {
            if (!walletToken) {
              // Token was cleared due to 401
              showDialog(
                'error',
                'Session Expired',
                'Your session has expired. Please sign the Web3 message again.',
              );
            } else {
              showDialog(
                'error',
                'Failed',
                'Failed to cancel listing. Please try again.',
              );
            }
          }
        } catch (error) {
          console.error('Error canceling listing:', error);
          showDialog('error', 'Error', 'Failed to cancel listing. Please try again.');
        } finally {
          setIsLoading(false);
        }
      },
      'danger',
    );
  };

  useEffect(() => {
    fetchMarketplaceData();
  }, [walletToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    walletNfts,
    currentListings,
    availableNfts,
    allNfts,
    selectedNfts,
    isLoading,
    listingPrice,
    setListingPrice,
    loadingProgress,
    isCancelling,
    cancellingProgress,
    isListing,
    listingProgress,
    handleBulkList,
    handleSelectNft,
    handleSelectAll,
    handleSelectAllListed,
    handleBulkCancel,
    handleCancelListing,
    fetchMarketplaceData,
    // Dialog states and controls
    dialog,
    closeDialog,
    confirmDialog,
    closeConfirmDialog,
    // Cancel operation controls
    cancelCancellingOperation,
    cancelListingOperation,
  };
};
