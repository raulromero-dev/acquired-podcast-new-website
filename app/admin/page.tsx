"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Check for auth token in localStorage
    const token = localStorage.getItem("admin_session")

    if (!token) {
      router.replace("/admin/login")
      return
    }

    // Validate token (check expiry)
    try {
      const decoded = atob(token)
      const [username, expiryStr] = decoded.split(":")
      const expiry = Number.parseInt(expiryStr, 10)

      if (username !== "admin-1" || Date.now() >= expiry) {
        localStorage.removeItem("admin_session")
        router.replace("/admin/login")
        return
      }

      setIsAuthenticated(true)
    } catch (err) {
      localStorage.removeItem("admin_session")
      router.replace("/admin/login")
    }
  }, [router])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <AdminDashboard />
}
