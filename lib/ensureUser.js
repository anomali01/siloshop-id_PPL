import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export async function ensureUserExists(userId) {
  if (!userId) return null;
  
  // Try to find the user in the database
  let user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    console.log(`[ensureUserExists] User ${userId} not found in database. Fetching from Clerk...`);
    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);
      const email = clerkUser.emailAddresses[0]?.emailAddress || "noemail@clerk.dev";
      const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User";
      const image = clerkUser.imageUrl || "";

      user = await prisma.user.create({
        data: {
          id: userId,
          email,
          name,
          image,
        },
      });
      console.log(`[ensureUserExists] Successfully synced user ${userId} to database.`);
    } catch (error) {
      console.error(`[ensureUserExists] Failed to sync user ${userId}:`, error);
    }
  }

  return user;
}
