"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, Presentation } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Presentation className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl">Sommaire</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="#features" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium">
                Features
              </Link>
              <Link href="#how-it-works" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium">
                How It Works
              </Link>
              <Link href="#pricing" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium">
                Pricing
              </Link>
              <Link href="#contact" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              <ThemeToggle />
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-background inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t">
            <Link href="#features" className="text-foreground hover:text-primary block px-3 py-2 text-base font-medium">
              Features
            </Link>
            <Link href="#how-it-works" className="text-foreground hover:text-primary block px-3 py-2 text-base font-medium">
              How It Works
            </Link>
            <Link href="#pricing" className="text-foreground hover:text-primary block px-3 py-2 text-base font-medium">
              Pricing
            </Link>
            <Link href="#contact" className="text-foreground hover:text-primary block px-3 py-2 text-base font-medium">
              Contact
            </Link>
            <div className="pt-4 pb-3 border-t border-border">
              <div className="flex items-center px-3 space-x-3 mb-3">
                <ThemeToggle />
                <span className="text-sm text-muted-foreground">Toggle theme</span>
              </div>
              <div className="flex items-center px-3 space-x-3">
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
