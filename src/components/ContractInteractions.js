import React from 'react';
import { constants } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

const ContractInteractions = ({
  operator,
  allowanceAmount,
  setAllowanceAmount,
  onApproveNFTs,
  onAllowanceION
}) => {
  const handleMaxAmount = () => {
    setAllowanceAmount(
      formatEther(constants.MaxUint256).toString()
    );
  };

  return (
    <div className="space-y-3">
      {/* Approval */}
      <div className="space-y-3">
        <div className="flex justify-center items-center bg-gray-300 text-black rounded-md">
          <p>Approval</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => onApproveNFTs(true)}
            className="h-12 w-full p-3 rounded-lg flex justify-center items-center space-x-3 bg-[#1d67cd] transition-all duration-1000 ease-out"
          >
            <p>Approve NFTs</p>
          </button>
          <button
            onClick={() => onApproveNFTs(false)}
            className="h-12 w-full p-3 rounded-lg flex justify-center items-center space-x-3 border border-[#1d67cd] transition-all duration-1000 ease-out"
          >
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
              onClick={handleMaxAmount}
              className="p-3 bg-[#1d67cd] rounded-r-lg"
            >
              Max
            </button>
          </div>
          <button
            onClick={() => onAllowanceION(true)}
            className="h-12 w-full p-3 rounded-lg flex justify-center items-center space-x-3 bg-[#1d67cd] transition-all duration-1000 ease-out"
          >
            <p>Increase ION Allowance</p>
          </button>
          <button
            onClick={() => onAllowanceION(false)}
            className="h-12 w-full p-3 rounded-lg flex justify-center items-center space-x-3 border border-[#1d67cd] transition-all duration-1000 ease-out"
          >
            <p>Decrease ION Allowance</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractInteractions; 