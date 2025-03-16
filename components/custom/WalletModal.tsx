'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useId } from 'react'
import { sign as web3TokenSign } from "web3-token"

import { useAccount, useConnect, useSignMessage } from 'wagmi'
import { signIn } from "next-auth/react"

export function WalletModal() {
  const id = useId()

  const { connectors, connectAsync } = useConnect()
  const { isConnected, address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const metaMaskConnector = connectors.find((c) => c.id === 'metaMaskSDK')

  const connectMetamask = async () => {
    try {
      if (!metaMaskConnector) {
        alert('MetaMask is not installed')
        return
      }

      let connectedAddress = address

      if (!isConnected) {
        const user = await connectAsync({ connector: metaMaskConnector })
        connectedAddress = user.accounts[0]
      }

      if (connectedAddress) {
        const accessToken = await web3TokenSign(
          async (msg) =>
            await signMessageAsync({
              message: msg,
            }),
          '3d',
        )

        const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days

        const result = await signIn("metamask", {
          address: connectedAddress,
          accessToken,
          expires: expiresAt,
          redirect: false,
        });

        if (result?.ok) {
          console.log("Sign-in successful", result);
        } else {
          console.error("Sign-in failed", result);
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Connect Wallet</Button>
      </DialogTrigger>

      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="border-border flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <svg
              className="stroke-zinc-800 dark:stroke-zinc-100"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
            </svg>
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Welcome back</DialogTitle>
            <DialogDescription className="sm:text-center">
              Enter your credentials to signin to your account.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Button variant="outline" onClick={connectMetamask}>
        Signin with Metamask
        </Button>
        <Button variant="destructive">Signin with Google</Button>

        <div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1">
          <span className="text-muted-foreground text-xs">Or</span>
        </div>

        <form className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input id={`${id}-email`} placeholder="thomas.x@maxion.tech" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-password`}>Password</Label>
              <Input id={`${id}-password`} placeholder="Enter your password" type="password" required />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex items-center gap-2">
              <Checkbox id={`${id}-remember`} />
              <Label htmlFor={`${id}-remember`} className="text-muted-foreground font-normal">
                Remember me
              </Label>
            </div>
            <a className="text-sm underline hover:no-underline" href="#">
              Forgot password?
            </a>
          </div>
          <Button type="button" className="w-full">
            Sign in
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
