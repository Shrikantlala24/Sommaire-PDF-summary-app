import { SignIn } from '@clerk/nextjs'
import { FileText, Sparkles, Share2 } from 'lucide-react'

export default function Page() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Side - Welcome Section */}
  <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center px-16 py-12 text-white max-w-lg mx-auto">
          <div className="mb-12">
            <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-8 backdrop-blur-sm border border-white/30">
              <FileText className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">Welcome Back to Sommaire</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Transform your PDFs into engaging visual stories with AI-powered summaries
            </p>
          </div>
          {/* Feature Steps */}
          <div className="space-y-6">
            <div className="flex items-start space-x-5">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm flex-shrink-0 border border-white/30">
                <span className="text-base font-bold">1</span>
              </div>
              <div className="pt-1">
                <h3 className="font-bold mb-2 text-lg">Upload Your PDF</h3>
                <p className="text-blue-100 text-base leading-relaxed">Simply drag and drop your PDF document to get started</p>
              </div>
            </div>
            <div className="flex items-start space-x-5">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm flex-shrink-0 border border-white/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="pt-1">
                <h3 className="font-bold mb-2 text-lg">AI Magic Happens</h3>
                <p className="text-blue-100 text-base leading-relaxed">Our AI analyzes and creates beautiful visual summaries</p>
              </div>
            </div>
            <div className="flex items-start space-x-5">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm flex-shrink-0 border border-white/30">
                <Share2 className="w-6 h-6" />
              </div>
              <div className="pt-1">
                <h3 className="font-bold mb-2 text-lg">Share & Present</h3>
                <p className="text-blue-100 text-base leading-relaxed">Export or share your stunning carousel presentations</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Welcome Back
            </h2>
            <p className="text-muted-foreground">
              Sign in to continue to Sommaire
            </p>
          </div>
          
          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Sign In to Your Account
            </h2>
            <p className="text-muted-foreground">
              Welcome back! Please enter your details to continue.
            </p>
          </div>
          
          <SignIn 
            forceRedirectUrl="/upload"
            signUpUrl="/sign-up"
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
            redirectUrl="/upload"
          />
        </div>
      </div>
    </div>
  )
}
