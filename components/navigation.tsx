"use client"

import Link from "next/link"
import { useEffect } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AcquiredLogo } from "./acquired-logo"
import { ThemeToggle } from "./theme-toggle"
import { useNav } from "./nav-context"

const navLinks = [
  { href: "/episodes", label: "Episodes" },
  { href: "/about", label: "About" },
  {
    href: "https://acquiredfm.slack.com/join/shared_invite/zt-39xytq2k0-8Ys_pdufzzhS3ETJOyW7aQ",
    label: "Slack",
    external: true,
  },
  { href: "/brand", label: "Brand" },
]

export function Navigation() {
  const { isMobileMenuOpen: isOpen, setIsMobileMenuOpen: setIsOpen } = useNav()

  useEffect(() => {
    const handleScroll = () => {
      // scrolled state removed as it's not used for visual changes currently
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - outside the pill */}
          <Link href="/" className="relative z-50">
            <AcquiredLogo />
          </Link>

          {/* Desktop Navigation - Centered floating pill */}
          <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center rounded-full glass border border-border/50 px-1.5 py-1.5 transition-all duration-300">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </div>

          {/* Right side - Theme toggle and CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/episodes"
              className="px-5 py-2 text-sm font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
            >
              Listen
            </Link>
          </div>

          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-50 p-2.5 rounded-full glass border border-border/50 text-foreground"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Backdrop blur layer */}
              <motion.div
                className="absolute inset-0 bg-background/70 backdrop-blur-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {/* Subtle gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-accent/5" />

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center">
                {/* Floating pill container for nav links */}
                <motion.div
                  className="glass border border-border/30 rounded-3xl px-12 py-10 mx-6"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="flex flex-col items-center gap-2">
                    {navLinks.map((link, index) =>
                      link.external ? (
                        <motion.a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)}
                          className="px-6 py-3 text-base text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-all duration-200"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                        >
                          {link.label}
                        </motion.a>
                      ) : (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="block px-6 py-3 text-base text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-all duration-200"
                          >
                            {link.label}
                          </Link>
                        </motion.div>
                      ),
                    )}
                  </div>
                </motion.div>

                {/* Bottom actions */}
                <motion.div
                  className="flex items-center gap-4 mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="glass border border-border/30 rounded-full p-1">
                    <ThemeToggle />
                  </div>
                  <Link
                    href="/episodes"
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2.5 text-sm font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
                  >
                    Listen Now
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
