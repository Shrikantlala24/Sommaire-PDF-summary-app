import { redirect } from 'next/navigation'

export default function LoggedInRoot() {
  // Redirect to upload page as the default logged-in experience
  redirect('/upload')
}
