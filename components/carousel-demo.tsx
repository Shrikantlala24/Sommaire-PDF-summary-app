"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Upload } from "lucide-react"

const demoSlides = [
  {
    title: "Executive Summary",
    content: "This quarterly report shows a 15% increase in revenue, driven by strong performance in digital products and strategic partnerships.",
    keyPoints: ["15% revenue growth", "Digital products leading", "Strategic partnerships success"]
  },
  {
    title: "Financial Highlights",
    content: "Revenue reached $2.3M with improved margins. Cost optimization initiatives resulted in 12% reduction in operational expenses.",
    keyPoints: ["$2.3M revenue", "Improved margins", "12% cost reduction"]
  },
  {
    title: "Key Recommendations",
    content: "Focus on expanding digital offerings, strengthen partner relationships, and continue operational efficiency improvements.",
    keyPoints: ["Expand digital offerings", "Strengthen partnerships", "Improve efficiency"]
  }
]

export function CarouselDemo() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % demoSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + demoSlides.length) % demoSlides.length)
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See Your PDFs Transform into 
            <span className="text-primary"> Beautiful Carousels</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch how a complex PDF document becomes an engaging, shareable carousel presentation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Upload Simulation */}
          <div className="space-y-6">
            <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center bg-primary/5">
              <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Upload Your PDF</h3>
              <p className="text-muted-foreground mb-4">
                Drop your document here or click to browse
              </p>
              <div className="bg-background rounded-lg p-4 max-w-sm mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-10 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">
                    PDF
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">quarterly-report.pdf</p>
                    <p className="text-xs text-muted-foreground">2.4 MB</p>
                  </div>
                  <div className="text-green-600 text-sm">✓</div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                <span>AI analyzing document...</span>
              </div>
            </div>
          </div>

          {/* Carousel Output */}
          <div className="relative">
            <Card className="overflow-hidden shadow-xl">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-primary/10 to-primary/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {currentSlide + 1} / {demoSlides.length}
                    </div>
                  </div>
                  
                  <div className="bg-background rounded-lg p-6 min-h-[300px]">
                    <h3 className="text-xl font-bold mb-4 text-primary">
                      {demoSlides[currentSlide].title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {demoSlides[currentSlide].content}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Key Points:</h4>
                      <ul className="space-y-1">
                        {demoSlides[currentSlide].keyPoints.map((point, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <Button variant="outline" size="sm" onClick={prevSlide}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex space-x-2">
                      {demoSlides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentSlide ? 'bg-primary' : 'bg-primary/30'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <Button variant="outline" size="sm" onClick={nextSlide}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
