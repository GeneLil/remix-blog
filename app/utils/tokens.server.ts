import jwt from "jsonwebtoken";
import { prisma } from "~/utils/db.server";
import { sessionStorage } from "~/utils/session.server";

export const ACCESS_TOKEN_EXPIRES_IN_MINUTES = 15;
export const REFRESH_TOKEN_EXPIRES_IN_DAYS = 30;

export const generateAccessToken = (userId: string) =>
  jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: `${ACCESS_TOKEN_EXPIRES_IN_MINUTES}m`,
  });

export const generateRefreshToken = (userId: string) =>
  jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: `${REFRESH_TOKEN_EXPIRES_IN_DAYS}d`,
  });

export const getValidAccessToken = async (request: Request) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );
  const userId = session.get("userId");

  if (!userId) {
    throw new Error("User not found in session");
  }

  const tokenEntry = await prisma.token.findUnique({
    where: { userId },
  });

  if (!tokenEntry || !tokenEntry.refreshToken) {
    throw new Error("No refresh token found, please log in again");
  }

  try {
    jwt.verify(tokenEntry.refreshToken, process.env.REFRESH_TOKEN_SECRET!);
  } catch {
    throw new Error("Invalid refresh token, please log in again");
  }

  return generateAccessToken(userId);
};
