import prisma from "@/lib/prisma";
import { ensureUserExists } from "@/lib/ensureUser";

const authSeller = async (userId) => {
  try {
    await ensureUserExists(userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        store: true,
      },
    });

    if (user && user.store) {
      if (user.store.status !== "APPROVED") {
        return user.store.id;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default authSeller;
