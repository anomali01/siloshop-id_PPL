import { inngest } from "./client";
import prisma from "@/lib/prisma";

// Inngest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-create" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;

    // Cari email utama
    const primaryEmail =
      data.email_addresses?.find((e) => e.id === data.primary_email_address_id)
        ?.email_address ||
      data.email_addresses?.[0]?.email_address ||
      "noemail@clerk.dev";

    await prisma.user.create({
      data: {
        id: data.id,
        email: primaryEmail, // ✅ gunakan hasil dari atas
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        image: data.image_url,
      },
    });
  }
);

// Inngest Function to update user data in database
export const syncUserUpdation = inngest.createFunction(
  { id: "sync-user-update" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event;

    const primaryEmail =
      data.email_addresses?.find((e) => e.id === data.primary_email_address_id)
        ?.email_address ||
      data.email_addresses?.[0]?.email_address ||
      "noemail@clerk.dev";

    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: primaryEmail,
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        image: data.image_url,
      },
    });
  }
);

// Inngest Function to delete user from database
export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.delete({
      where: { id: data.id },
    });
  }
);

// Inngest Function to delete coupon on expiration
export const deleteCouponOnExpiry = inngest.createFunction(
  { id: "delete-coupon-on-expiry" },
  { event: "app/coupon.expired" },
  async ({ event, step }) => {
    const { data } = event;
    const expiryDate = new Date(data.expires_at);
    await step.sleepUntil("wait-for-expiry", expiryDate);

    await step.run("delete-coupon-from-database", async () => {
      await prisma.coupon.delete({
        where: { code: data.code },
      });
    });
  }
);
