import axios from 'axios';
import { useEffect, useState } from 'react';
import { apiUrls } from '../config';

export const useInventoryOperations = (token) => {
  const [inventories, setInventories] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0 });
  const [isMinting, setIsMinting] = useState(false);
  const [mintingProgress, setMintingProgress] = useState({ current: 0, total: 0 });

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

  const fetchInventories = async () => {
    if (!token) return [];
    setIsLoading(true);
    setLoadingProgress({ current: 1, total: 1 });

    const res = await axios
      .get(`${apiUrls.maxi}/mint-inventory`, {
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
      .get(`${apiUrls.maxi}/mint-inventory`, {
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
        let processedCount = 0;
        let successCount = 0;
        let failCount = 0;
        const totalItems = selectedItems.size;

        for (const inventoryId of selectedItems) {
          try {
            setMintingProgress({ current: processedCount + 1, total: totalItems });

            await axios
              .post(
                `${apiUrls.maxi}/mint-inventory/mint`,
                { mintInventoryId: inventoryId },
                { headers: { Authorization: `Bearer ${token}`, 'X-Server-Id': 1 } },
              )
              .then(async () => {
                await refetchInventoriesWithoutLoading();
                successCount++;
              });

            processedCount++;
            await sleep(2000);
          } catch (error) {
            console.log(error);
            failCount++;
            processedCount++;
            await sleep(4000);
          }
        }

        showDialog(
          successCount > 0 && failCount === 0
            ? 'success'
            : failCount > 0
            ? 'warning'
            : 'info',
          'Minting Complete',
          `Minting complete! Success: ${successCount}, Failed: ${failCount}`,
        );

        setSelectedItems(new Set());
        setIsMinting(false);
        setMintingProgress({ current: 0, total: 0 });
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
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

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
  };
};
