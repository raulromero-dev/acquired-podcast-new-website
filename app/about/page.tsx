import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AboutHero } from "@/components/about/about-hero"
import { QuotesSection } from "@/components/about/quotes-section"
import { AudienceSection } from "@/components/about/audience-section"
import { SponsorshipSection } from "@/components/about/sponsorship-section"

export const metadata = {
  title: "About | Acquired",
  description: "The #1 technology podcast telling the stories and strategies of great companies.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <AboutHero />
      <QuotesSection />
      <AudienceSection />
      <SponsorshipSection />
      <Footer />
    </main>
  )
}
