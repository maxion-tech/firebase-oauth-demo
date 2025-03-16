import { roninWallet } from '@sky-mavis/tanto-wagmi'
import { cookieStorage, createConfig, createStorage, http } from 'wagmi'
import { bsc, bscTestnet, ronin, saigon } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'
import { maxiMainnet, maxiTestnet } from './chains'
import { APP_ENV } from '@/enums/app'

export const wagmiConfig = createConfig({
  chains: [bsc, bscTestnet, maxiTestnet, maxiMainnet, saigon, ronin],
  transports: {
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
    [maxiMainnet.id]: http(),
    [maxiTestnet.id]: http(),
    [ronin.id]: http(),
    [saigon.id]: http(),
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  connectors: [metaMask(), roninWallet()],
})

export const CURRENT_APP_ENV: APP_ENV = process.env.NEXT_PUBLIC_APP_ENV
  ? (process.env.NEXT_PUBLIC_APP_ENV as APP_ENV)
  : APP_ENV.development
