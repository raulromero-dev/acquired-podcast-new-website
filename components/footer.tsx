"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { AcquiredLogo } from "./acquired-logo"
import { GrainBackground } from "./grain-background"

const footerLinks = {
  podcast: [{ label: "Episodes", href: "/episodes" }],
  company: [
    { label: "About", href: "/about" },
    { label: "Brand", href: "/brand" },
  ],
  community: [{ label: "Slack", href: "/slack" }],
  listen: [
    { label: "Apple Podcasts", href: "https://podcasts.apple.com/us/podcast/acquired/id1050462261" },
    { label: "Spotify", href: "https://open.spotify.com/show/7Fj0XEuUQLUqoMZQdsLXqp" },
    { label: "YouTube", href: "https://www.youtube.com/@AcquiredFM" },
  ],
}

function FooterLink({ link, index }: { link: { label: string; href: string }; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={link.href} className="text-sm text-muted-foreground hover:text-accent transition-colors">
        {link.label}
      </Link>
    </motion.li>
  )
}

export function Footer() {
  return (
    <GrainBackground intensity="subtle" className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12">
          {/* Logo and tagline */}
          <motion.div
            className="col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <AcquiredLogo className="mb-6" />
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Every company has a story. Learn the playbooks that built the world's greatest companies.
            </p>
          </motion.div>

          {/* Links */}
          <div>
            <motion.h4
              className="text-xs font-medium text-foreground mb-5 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              Podcast
            </motion.h4>
            <ul className="space-y-3">
              {footerLinks.podcast.map((link, i) => (
                <FooterLink key={link.href} link={link} index={i} />
              ))}
            </ul>
          </div>

          <div>
            <motion.h4
              className="text-xs font-medium text-foreground mb-5 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              Company
            </motion.h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, i) => (
                <FooterLink key={link.href} link={link} index={i} />
              ))}
            </ul>
          </div>

          <div>
            <motion.h4
              className="text-xs font-medium text-foreground mb-5 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              Community
            </motion.h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link, i) => (
                <FooterLink key={link.href} link={link} index={i} />
              ))}
            </ul>
          </div>

          <div>
            <motion.h4
              className="text-xs font-medium text-foreground mb-5 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              Listen
            </motion.h4>
            <ul className="space-y-3">
              {footerLinks.listen.map((link, i) => (
                <FooterLink key={link.href} link={link} index={i} />
              ))}
            </ul>
          </div>
        </div>

        <motion.div
          className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Acquired. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-accent transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-accent transition-colors">
              Terms
            </Link>
          </div>
        </motion.div>
      </div>
    </GrainBackground>
  )
}
