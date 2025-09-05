import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Presentation, Upload, Sparkles, Share2, FileText, BarChart3, Users, Download } from "lucide-react"

const features = [
  {
    icon: Upload,
    title: "Smart PDF Upload",
    description: "Simply drag and drop your PDF files. Our system intelligently processes documents of any size and format, extracting text, images, and structure.",
    highlights: ["Supports all PDF types", "Batch processing", "OCR for scanned docs"]
  },
  {
    icon: Sparkles,
    title: "AI-Powered Analysis",
    description: "Advanced AI models analyze your content using Gemini and ChatGPT APIs, understanding context and extracting the most important information.",
    highlights: ["Multi-model AI processing", "Context-aware summaries", "Key insight extraction"]
  },
  {
    icon: Presentation,
    title: "Interactive Carousels",
    description: "Transform summaries into beautiful, swipeable carousel presentations. Perfect for social media, presentations, or quick sharing.",
    highlights: ["Customizable templates", "Mobile-optimized", "Export options"]
  },
  {
    icon: Share2,
    title: "Easy Sharing & Export",
    description: "Share your carousels instantly with secure links or export in multiple formats. Built-in analytics track engagement and views.",
    highlights: ["Secure sharing links", "Multiple export formats", "View analytics"]
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Powerful Features for Every Need
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From individual professionals to enterprise teams, Sommaire adapts to your document processing needs
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card key={index} className="border-0 shadow-lg bg-background/50 backdrop-blur">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-base mb-4">
                    {feature.description}
                  </CardDescription>
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg w-fit mx-auto mb-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold mb-1">Multiple Formats</h4>
            <p className="text-sm text-muted-foreground">PDF, DOCX, TXT, and more</p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg w-fit mx-auto mb-3">
              <Share2 className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold mb-1">Instant Sharing</h4>
            <p className="text-sm text-muted-foreground">Share carousels with one click</p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg w-fit mx-auto mb-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold mb-1">Team Collaboration</h4>
            <p className="text-sm text-muted-foreground">Share and collaborate easily</p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg w-fit mx-auto mb-3">
              <Download className="h-6 w-6 text-orange-600" />
            </div>
            <h4 className="font-semibold mb-1">Export Options</h4>
            <p className="text-sm text-muted-foreground">Multiple export formats</p>
          </div>
        </div>
      </div>
    </section>
  )
}
