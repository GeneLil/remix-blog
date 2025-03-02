import bcrypt from "bcryptjs";
import { prisma } from "~/utils/db.server";
import { sessionStorage } from "./session.server";

// Хеширование пароля
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

// Проверка пароля
export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export async function getUser(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  const userId = session.get("userId");
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
    omit: { password: true },
  });
}
