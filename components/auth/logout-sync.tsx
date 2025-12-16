"use client"

import { useEffect, useCallback } from "react"
import { signOut, useSession } from "next-auth/react"

const LOGOUT_CHANNEL = "kafe-pos-logout"

export function useLogoutSync() {
  const { status } = useSession()

  useEffect(() => {
    // Only set up listener if authenticated
    if (status !== "authenticated") return

    // Create broadcast channel for cross-tab communication
    const channel = new BroadcastChannel(LOGOUT_CHANNEL)

    // Listen for logout events from other tabs
    channel.onmessage = (event) => {
      if (event.data === "logout") {
        // Force sign out without triggering broadcast (to avoid loop)
        signOut({ callbackUrl: "/auth/login", redirect: true })
      }
    }

    return () => {
      channel.close()
    }
  }, [status])

  // Function to logout and broadcast to other tabs
  const handleLogout = useCallback(async () => {
    // Broadcast logout to other tabs first
    try {
      const channel = new BroadcastChannel(LOGOUT_CHANNEL)
      channel.postMessage("logout")
      channel.close()
    } catch (e) {
      // BroadcastChannel not supported, continue with normal logout
    }
    
    // Then sign out this tab
    await signOut({ callbackUrl: "/auth/login" })
  }, [])

  return { handleLogout }
}

// Wrapper component that syncs logout across tabs
export function LogoutSyncProvider({ children }: { children: React.ReactNode }) {
  useLogoutSync()
  return <>{children}</>
}

