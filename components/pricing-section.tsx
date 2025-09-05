import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out PDF to carousel generation",
    features: [
      "5 PDF conversions per month",
      "Basic carousel templates",
      "Standard processing speed",
      "Email support",
      "Shareable links",
      "Basic export options"
    ],
    limitations: [
      "Max 20 pages per PDF",
      "Watermarked carousels",
      "Standard templates only"
    ],
    buttonText: "Start Free",
    buttonVariant: "outline" as const,
    popular: false
  },
  {
    name: "Professional",
    price: "$19",
    period: "per month",
    description: "Ideal for content creators and professionals",
    features: [
      "100 PDF conversions per month",
      "Premium carousel templates",
      "Priority AI processing",
      "Priority support",
      "Custom branding",
      "Advanced export formats",
      "Analytics dashboard",
      "API access",
      "Batch processing"
    ],
    limitations: [],
    buttonText: "Start Professional",
    buttonVariant: "default" as const,
    popular: true
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    description: "For teams and organizations with high-volume needs",
    features: [
      "Unlimited PDF conversions",
      "White-label solution",
      "Custom AI model fine-tuning",
      "Dedicated account manager",
      "Custom integrations",
      "Advanced security features",
      "Team collaboration tools",
      "Custom carousel themes",
      "SLA guarantee",
      "On-premise deployment option"
    ],
    limitations: [],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    popular: false
  }
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the plan that fits your needs. All plans include our core AI summarization features.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-muted p-1 rounded-lg">
            <button className="px-4 py-2 text-sm font-medium bg-background text-foreground rounded-md shadow-sm">
              Monthly
            </button>
            <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Annual
              <Badge variant="secondary" className="ml-2">Save 20%</Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${
                plan.popular 
                  ? 'border-primary shadow-lg scale-105' 
                  : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <CardDescription className="mt-2 text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 py-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-4 w-4 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, idx) => (
                    <li key={idx} className="flex items-start text-muted-foreground">
                      <div className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 flex items-center justify-center">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                      </div>
                      <span className="text-sm">{limitation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="px-6 pt-4 pb-6">
                <Button 
                  variant={plan.buttonVariant}
                  className="w-full"
                  size="lg"
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Enterprise Contact */}
        <div className="mt-16 text-center">
          <div className="bg-muted/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Need Something Custom?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We offer custom solutions for large enterprises with specific requirements. 
              Contact our sales team to discuss volume pricing, custom integrations, and enterprise features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg">
                Schedule a Demo
              </Button>
              <Button size="lg">
                Contact Sales Team
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
