import { auth, currentUser } from '@clerk/nextjs/server';
import { createUser, getUserByEmail } from './db';

export async function getOrCreateUserFromClerk() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized - no user ID');
  }

  // Get the full user object from Clerk
  const clerkUser = await currentUser();
  
  if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
    throw new Error('No email address found for user');
  }

  const email = clerkUser.emailAddresses[0].emailAddress;
  const fullName = clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();

  // Get or create user in our database
  let user = await getUserByEmail(email);
  if (!user) {
    user = await createUser(email, fullName || undefined, userId);
  }

  return {
    user,
    clerkUser,
    email,
    fullName
  };
}
