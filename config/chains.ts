import { type Chain } from "viem";
import { bsc, bscTestnet, ronin, saigon } from "wagmi/chains";

export const maxiTestnet: Chain = {
  id: 898,
  name: "Maxi Testnet",
  nativeCurrency: {
    name: "MGAS",
    symbol: "MGAS",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-testnet.maxi.network"],
    },
    public: {
      http: ["https://rpc-testnet.maxi.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Maxi Testnet Explorer",
      url: "https://testnet.maxi.network",
    },
  },
  testnet: true,
} as const;

export const maxiMainnet: Chain = {
  id: 899,
  name: "Maxi Mainnet",
  nativeCurrency: {
    name: "MGAS",
    symbol: "MGAS",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.maxi.network"],
    },
    public: {
      http: ["https://rpc.maxi.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Maxi Mainnet Explorer",
      url: "https://mainnet.maxi.network",
    },
  },
  testnet: false,
} as const;

// ALL CHAINS
export const CHAINS: Chain[] = [
  bsc,
  bscTestnet,
  maxiTestnet,
  maxiMainnet,
  ronin,
  saigon,
];
