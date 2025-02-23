import bcrypt from "bcryptjs";

// Хеширование пароля
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

// Проверка пароля
export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
