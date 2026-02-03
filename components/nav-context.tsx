"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface NavContextType {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}

const NavContext = createContext<NavContextType | undefined>(undefined)

export function NavProvider({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return <NavContext.Provider value={{ isMobileMenuOpen, setIsMobileMenuOpen }}>{children}</NavContext.Provider>
}

export function useNav() {
  const context = useContext(NavContext)
  if (context === undefined) {
    throw new Error("useNav must be used within a NavProvider")
  }
  return context
}
