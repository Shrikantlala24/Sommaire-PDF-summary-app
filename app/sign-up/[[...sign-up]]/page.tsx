import { SignUp } from '@clerk/nextjs'
import { FileText, Zap, Users, Crown } from 'lucide-react'

export default function Page() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Side - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center px-16 py-12 text-white max-w-lg mx-auto">
          <div className="mb-12">
            <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-8 backdrop-blur-sm border border-white/30">
              <FileText className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">Join Sommaire Today</h1>
            <p className="text-xl text-purple-100 leading-relaxed">
              Start creating amazing visual summaries from your PDFs in minutes
            </p>
          </div>
          
          {/* Feature Benefits */}
          <div className="space-y-6">
            <div className="flex items-start space-x-5">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm flex-shrink-0 border border-white/30">
                <Zap className="w-6 h-6" />
              </div>
              <div className="pt-1">
                <h3 className="font-bold mb-2 text-lg">Lightning Fast AI</h3>
                <p className="text-purple-100 text-base leading-relaxed">Get professional summaries in seconds, not hours</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-5">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm flex-shrink-0 border border-white/30">
                <Users className="w-6 h-6" />
              </div>
              <div className="pt-1">
                <h3 className="font-bold mb-2 text-lg">Team Collaboration</h3>
                <p className="text-purple-100 text-base leading-relaxed">Share and collaborate with your team seamlessly</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-5">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm flex-shrink-0 border border-white/30">
                <Crown className="w-6 h-6" />
              </div>
              <div className="pt-1">
                <h3 className="font-bold mb-2 text-lg">Premium Quality</h3>
                <p className="text-purple-100 text-base leading-relaxed">Export high-resolution carousels for any platform</p>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-purple-100 text-base">
              ✨ Join thousands of professionals already using Sommaire
            </p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-32 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 right-8 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Get Started
            </h2>
            <p className="text-muted-foreground">
              Create your Sommaire account
            </p>
          </div>
          
          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Create Your Account
            </h2>
            <p className="text-muted-foreground">
              Get started with Sommaire and transform your PDFs today.
            </p>
          </div>
          
          <SignUp 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none bg-transparent border-0 p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "flex items-center justify-center gap-3 w-full h-11 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 bg-card text-card-foreground rounded-md font-medium transition-colors hover:bg-accent hover:text-accent-foreground hover:border-primary/50 shadow-sm",
                socialButtonsBlockButtonText: "text-card-foreground font-medium text-sm",
                socialButtonsBlockButtonArrow: "text-muted-foreground",
                dividerLine: "bg-border h-px",
                dividerText: "text-muted-foreground text-sm px-4 bg-background",
                formFieldLabel: "text-foreground font-medium text-sm mb-2 block",
                formFieldInput: "flex h-11 w-full rounded-md border-2 border-gray-300 dark:border-gray-600 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                formButtonPrimary: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 py-2 w-full shadow-sm",
                footerActionLink: "text-primary hover:text-primary/80 underline underline-offset-4 text-sm font-medium",
                identityPreviewText: "text-foreground",
                identityPreviewEditButton: "text-primary hover:text-primary/80",
                formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground transition-colors p-2 rounded",
                otpCodeFieldInput: "flex h-11 w-full rounded-md border-2 border-gray-300 dark:border-gray-600 bg-background text-center text-foreground text-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
                formResendCodeLink: "text-primary hover:text-primary/80 underline underline-offset-4 text-sm",
                formFieldWarningText: "text-destructive text-sm mt-1",
                formFieldSuccessText: "text-green-600 dark:text-green-400 text-sm mt-1",
                formFieldHintText: "text-muted-foreground text-sm mt-1",
                formFieldAction: "mt-4"
              },
              variables: {
                colorPrimary: "hsl(var(--primary))",
                colorBackground: "hsl(var(--background))",
                colorInputBackground: "hsl(var(--background))",
                colorInputText: "hsl(var(--foreground))",
                colorText: "hsl(var(--foreground))",
                colorTextSecondary: "hsl(var(--muted-foreground))",
                colorNeutral: "hsl(var(--muted))",
                borderRadius: "0.375rem",
                fontFamily: "inherit"
              }
            }}
          />
          
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary hover:text-primary/80 underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:text-primary/80 underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
