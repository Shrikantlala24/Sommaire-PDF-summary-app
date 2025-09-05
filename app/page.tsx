import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { CarouselDemo } from "@/components/carousel-demo"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { FeaturesSection } from "@/components/features-section"
import { PricingSection } from "@/components/pricing-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <CarouselDemo />
        <HowItWorksSection />
        <FeaturesSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
