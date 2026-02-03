import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { EpisodesGrid } from "@/components/episodes-grid"
import { ValuesSection } from "@/components/values-section"
import { HostsSection } from "@/components/hosts-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <EpisodesGrid />
      <ValuesSection />
      <HostsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
