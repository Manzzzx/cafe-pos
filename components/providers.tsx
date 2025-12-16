"use client"

import { SessionProvider } from "next-auth/react"
import { LogoutSyncProvider } from "@/components/auth/logout-sync"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LogoutSyncProvider>
        {children}
      </LogoutSyncProvider>
    </SessionProvider>
  )
}
