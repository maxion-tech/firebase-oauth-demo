'use client'

import Connectors from '@/components/custom/Connectors'
import { ModeToggle } from '@/components/ui/toggle'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="@container mx-auto @max-sm:bg-red-500">
      <div className="flex min-h-screen items-start justify-between p-20 font-[family-name:var(--font-geist-sans)]">
        <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={180} height={38} priority />
        <div className="flex gap-4">
          <Connectors />
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}
