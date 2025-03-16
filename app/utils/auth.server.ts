import bcrypt from "bcryptjs";
import { prisma } from "~/utils/db.server";
import { sessionStorage } from "./session.server";
import { Authenticator } from "remix-auth";
import { OAuth2Strategy } from "remix-auth-oauth2";

export const googleAuth = new Authenticator();

type GoogleProfile = {
  id: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
};

googleAuth.use(
  new OAuth2Strategy(
    {
      authorizationEndpoint:
        "https://accounts.google.com/o/oauth2/auth?prompt=consent&access_type=offline",
      tokenEndpoint: "https://oauth2.googleapis.com/token",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectURI: process.env.GOOGLE_CALLBACK_REDIRECT!,
      scopes: ["openid", "profile", "email"],
    },
    async ({ tokens }) => {
      console.log("tokens", tokens);
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken()}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Error getting user info from Google");
      }

      const profile: GoogleProfile = await response.json();
      const profileData = {
        firstName: profile.given_name,
        lastName: profile.family_name,
        photoLink: profile.picture,
      };

      const tokensMap = {
        accessToken: tokens.accessToken(),
        tokenExpiresAt:
          Date.now() + tokens.accessTokenExpiresInSeconds() * 1000,
      };

      const existingUser = await prisma.user.findUnique({
        where: { email: profile.email },
      });

      if (!existingUser) {
        const newUser = await prisma.user.create({
          data: { email: profile.email, externalId: profile.id },
        });
        await prisma.profile.create({
          data: {
            userId: newUser.id,
            ...profileData,
          },
        });
        return { user: newUser, tokensMap };
      }

      await prisma.profile.update({
        where: { userId: existingUser.id },
        data: { ...profileData },
      });

      return { user: existingUser, tokensMap };
    },
  ),
  "google",
);

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

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
