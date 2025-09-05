import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Join Sommaire
          </h2>
          <p className="text-muted-foreground">
            Create your account and start converting PDFs to engaging carousels
          </p>
        </div>
        <SignUp />
      </div>
    </div>
  )
}
