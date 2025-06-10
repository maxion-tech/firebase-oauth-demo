import { useContractFunction } from '@usedapp/core';
import { Contract } from 'ethers';
import { Interface, parseUnits } from 'ethers/lib/utils';
import { contracts } from '../constants';
import ION_ABI from '../constants/abis/ion.json';
import NFT_ABI from '../constants/abis/nft.json';

export const useContractOperations = (switchNetwork) => {
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

  const handleApproveNFTs = async (approved, chain, operator) => {
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

  const handleAllowanceION = async (increased, chain, operator, allowanceAmount) => {
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

  return {
    handleApproveNFTs,
    handleAllowanceION,
  };
};
