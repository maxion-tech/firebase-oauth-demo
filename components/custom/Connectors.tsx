import { useAccount } from 'wagmi'
import Profile from './Profile'
import { WalletModal } from './WalletModal'
import { useSession } from 'next-auth/react'

export default function Connectors() {
  const { data: session } = useSession()
  const { connector } = useAccount()

  return <div>{session && connector ? <Profile /> : <WalletModal />}</div>
}
