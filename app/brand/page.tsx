import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BrandHero } from "@/components/brand/brand-hero"
import { LogoSection } from "@/components/brand/logo-section"
import { ColorSection } from "@/components/brand/color-section"
import { TypographySection } from "@/components/brand/typography-section"
import { DownloadSection } from "@/components/brand/download-section"
import { EpisodesCTA } from "@/components/episodes-cta"

export default function BrandPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <BrandHero />
      <LogoSection />
      <ColorSection />
      <TypographySection />
      <DownloadSection />
      <EpisodesCTA />
      <Footer />
    </main>
  )
}
