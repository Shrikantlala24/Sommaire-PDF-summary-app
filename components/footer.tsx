import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Presentation, Twitter, Linkedin, Github, Mail } from "lucide-react"

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "API Documentation", href: "/docs" },
    { name: "Integrations", href: "/integrations" },
    { name: "Changelog", href: "/changelog" }
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press Kit", href: "/press" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" }
  ],
  resources: [
    { name: "Help Center", href: "/help" },
    { name: "Getting Started", href: "/getting-started" },
    { name: "Best Practices", href: "/best-practices" },
    { name: "Video Tutorials", href: "/tutorials" },
    { name: "Community", href: "/community" }
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Data Processing", href: "/data-processing" },
    { name: "Security", href: "/security" }
  ]
}

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Presentation className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl">Sommaire</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Transform your PDFs into interactive carousel presentations with AI-powered analysis and beautiful design.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <Link 
                href="https://twitter.com" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link 
                href="https://linkedin.com" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link 
                href="https://github.com" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link 
                href="mailto:hello@sommaire.ai" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2025 Sommaire. All rights reserved.
          </div>
          
          {/* Contact Info */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              <span>hello@sommaire.ai</span>
            </div>
            <div className="hidden md:block">•</div>
            <div>
              <span>Available 24/7 worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
