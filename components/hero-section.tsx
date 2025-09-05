import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Presentation, Sparkles, Clock } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="pt-20 pb-12 md:pt-28 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
            <Presentation className="w-4 h-4 mr-2" />
            AI-Powered PDF to Carousel Generator
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            Transform PDFs into
            <span className="text-primary"> Interactive Carousels</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Upload any PDF and let our AI create beautiful, shareable carousel presentations with key insights and summaries in seconds.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            <Button size="lg" className="text-lg px-8 py-3 h-auto" asChild>
              <Link href="/signup">
                Start Summarizing Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 h-auto" asChild>
              <Link href="#demo">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Link>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-green-600" />
              <span>AI-powered accuracy</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-600" />
              <span>Process docs in under 30 seconds</span>
            </div>
            <div className="flex items-center">
              <Presentation className="w-4 h-4 mr-2 text-yellow-600" />
              <span>Interactive carousels</span>
            </div>
          </div>
        </div>
        
        {/* Hero Visual/Demo */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-8 md:p-12">
            <div className="bg-background rounded-xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-muted-foreground">sommaire.ai</div>
              </div>
              <div className="space-y-3">
                <div className="h-2 bg-muted rounded w-3/4"></div>
                <div className="h-2 bg-muted rounded w-1/2"></div>
                <div className="h-2 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-primary/20 rounded w-full mt-4"></div>
                <div className="h-2 bg-muted rounded w-2/3"></div>
                <div className="h-2 bg-muted rounded w-4/5"></div>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  ✅ Summary generated in 12 seconds
                </div>
                <div className="text-sm text-primary font-medium">
                  95% compression ratio
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
