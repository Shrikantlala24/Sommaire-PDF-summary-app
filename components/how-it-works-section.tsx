import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Brain, Presentation, Share2, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "Upload Your PDF",
    description: "Simply drag and drop your PDF file or click to browse. We support all PDF types including scanned documents with OCR.",
    details: "Supported formats: PDF, multi-page documents, scanned files"
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Our advanced AI models powered by Gemini and ChatGPT analyze your document, extracting key insights and main points.",
    details: "Processing time: Usually under 30 seconds"
  },
  {
    icon: Presentation,
    title: "Generate Carousel",
    description: "Transform the analysis into beautiful, interactive carousel slides optimized for engagement and easy understanding.",
    details: "Customizable templates and professional design"
  },
  {
    icon: Share2,
    title: "Share & Export",
    description: "Share your carousel with a secure link or export in multiple formats. Track views and engagement with built-in analytics.",
    details: "Export formats: PDF, PNG, interactive web link"
  }
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your PDF into an engaging carousel in just four simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Number */}
                <div className="absolute -top-4 left-6 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold z-10">
                  {index + 1}
                </div>
                
                <Card className="relative pt-6 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="mb-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">
                      {step.description}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      {step.details}
                    </p>
                  </CardContent>
                  
                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-20">
                      <ArrowRight className="h-5 w-5 text-primary/60" />
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">Ready to get started?</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <div className="text-sm text-muted-foreground">
              ✓ No credit card required
            </div>
            <div className="text-sm text-muted-foreground">
              ✓ 5 free conversions
            </div>
            <div className="text-sm text-muted-foreground">
              ✓ Start in 30 seconds
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
