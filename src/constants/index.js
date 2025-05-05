import { cmsFirebase, platformFirebase } from '../config/firebaseConfig';

export const ProviderType = Object.freeze({
  PLATFORM: 'PLATFORM',
  CMS: 'CMS',
});

export const providers = [
  {
    name: 'Maxion Platform',
    type: ProviderType.PLATFORM,
    firebaseApp: platformFirebase,
  },
  { name: 'Maxion CMS', type: ProviderType.CMS, firebaseApp: cmsFirebase },
];

export const chains = [
  // {
  //   name: 'Maxi Mainnet',
  //   chainId: 899,
  //   rpcUrl: 'https://rpc.maxi.network',
  // },
  // {
  //   name: 'BSC Mainnet',
  //   chainId: 56,
  //   rpcUrl: 'https://bsc-dataseed1.bnbchain.org',
  // },
  {
    name: 'Maxi Testnet',
    chainId: 898,
    rpcUrl: 'https://rpc-testnet.maxi.network',
  },
  // {
  //   name: 'BSC Testnet',
  //   chainId: 97,
  //   rpcUrl: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
  // },
];

export const contracts = {
  898: {
    nft: '0x872E84bE5A90D33AEa4C4dbcDe4CFBAA541206Ff',
    ion: '0xD2845F78B19e6811ca8b6A0b0F7a979A5D682e70',
  },
  97: {
    nft: '',
    ion: '',
  },
};

export const operators = {
  898: [
    {
      name: 'Marketplace Contract',
      address: '0xB5D2fC5628aE5537A9c62E9FCA1c242b470d455a',
    },
    {
      name: 'NFT Redeem Contract',
      address: '0x97f23294F47155C4CEF55088C80BE34b2aDC1ABc',
    },
    {
      name: 'Topup Contract',
      address: '0xcC5da0dA34dE144d4a3766F4Dd15C727E75B6116',
    },
  ],
  97: [
    {
      name: 'Marketplace Contract',
      address: '',
    },
    {
      name: 'NFT Redeem Contract',
      address: '',
    },
    {
      name: 'Topup Contract',
      address: '',
    },
  ],
};
