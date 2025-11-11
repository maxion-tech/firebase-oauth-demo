import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { apiUrls } from '../config';
import { DEFAULT_SERVER } from '../constants/servers';

export const useInventoryOperations = (token, selectedServer = DEFAULT_SERVER) => {
  const [inventories, setInventories] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0 });
  const [isMinting, setIsMinting] = useState(false);
  const [mintingProgress, setMintingProgress] = useState({ current: 0, total: 0 });

  // Cancel minting operation state
  const cancelMintingRef = useRef(false);

  // Dialog states
  const [dialog, setDialog] = useState({
    isOpen: false,
    type: 'info',
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

  // Cancel minting operation
  const cancelMintingOperation = () => {
    cancelMintingRef.current = true;
  };

  const resetMintingCancelState = () => {
    cancelMintingRef.current = false;
  };

  const fetchInventories = async () => {
    if (!token) return [];
    setIsLoading(true);
    setLoadingProgress({ current: 1, total: 1 });

    const res = await axios
      .get(`${apiUrls[selectedServer]}/mint-inventory`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Server-Id': 1,
        },
      })
      .catch((error) => {
        console.log('error: ', error.response.data);
        setIsLoading(false);
        setLoadingProgress({ current: 0, total: 0 });
        return [];
      });

    setIsLoading(false);
    setLoadingProgress({ current: 0, total: 0 });
    return res?.data?.filter(Boolean);
  };

  const getMintInventories = async () => {
    setInventories([]);
    const data = await fetchInventories();
    if (data) {
      setInventories(data);
      setSelectedItems(new Set(data.map((inventory) => inventory.id)));
    }
  };

  const refetchInventoriesWithoutLoading = async () => {
    if (!token) return [];

    const res = await axios
      .get(`${apiUrls[selectedServer]}/mint-inventory`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Server-Id': 1,
        },
      })
      .catch((error) => {
        console.log('error: ', error.response.data);
        return [];
      });

    const data = res?.data?.filter(Boolean);
    if (data) {
      setInventories(data);
    }
    return data;
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleBulkMint = async () => {
    showConfirmDialog(
      'Confirm Bulk Mint',
      'Are you sure you want to mint all selected items in your inventory?',
      async () => {
        setIsMinting(true);
        resetMintingCancelState();
        const totalItems = selectedItems.size;

        // Check if operation was cancelled before starting
        if (cancelMintingRef.current) {
          setIsMinting(false);
          setMintingProgress({ current: 0, total: 0 });
          resetMintingCancelState();
          return;
        }

        try {
          setMintingProgress({ current: 1, total: totalItems });

          // Build payload with items array
          const items = Array.from(selectedItems).map((inventoryId) => ({
            mintInventoryId: inventoryId,
          }));

          const result = await axios.post(
            `${apiUrls[selectedServer]}/mint-inventory/mint-batch`,
            { items },
            { headers: { Authorization: `Bearer ${token}`, 'X-Server-Id': 1 } },
          );

          if (result) {
            await refetchInventoriesWithoutLoading();
            setMintingProgress({ current: totalItems, total: totalItems });
            showDialog(
              'success',
              'Minting Complete',
              `Successfully minted ${totalItems} item(s)!`,
            );
          }
        } catch (error) {
          console.log(error);
          showDialog(
            'warning',
            'Minting Failed',
            error.response?.data?.message || `Failed to mint items. Please try again.`,
          );
        }

        setSelectedItems(new Set());
        setIsMinting(false);
        setMintingProgress({ current: 0, total: 0 });
        resetMintingCancelState();
      },
    );
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === inventories.length) {
      setSelectedItems(new Set());
    } else {
      const allIds = inventories.map((inventory) => inventory.id);
      setSelectedItems(new Set(allIds));
    }
  };

  useEffect(() => {
    getMintInventories();
  }, [token, selectedServer]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    inventories,
    selectedItems,
    isLoading,
    loadingProgress,
    isMinting,
    mintingProgress,
    handleBulkMint,
    handleSelectItem,
    handleSelectAll,
    getMintInventories,
    // Dialog states and controls
    dialog,
    closeDialog,
    confirmDialog,
    closeConfirmDialog,
    // Cancel minting operation
    cancelMintingOperation,
  };
};
