'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/toggle'

export default function Home() {
  return (
    <div className="@container mx-auto @max-sm:bg-red-500">
      <div className="z-0 flex min-h-screen items-center justify-between p-1 px-20 font-[family-name:var(--font-geist-sans)]">
        <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={180} height={38} priority />
        <ModeToggle />
        <Button>Button</Button>
      </div>
    </div>
  )
}
