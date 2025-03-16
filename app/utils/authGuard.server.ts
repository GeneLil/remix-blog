import { redirect } from "@remix-run/node";
import {
  getValidAccessToken,
  ACCESS_TOKEN_EXPIRES_IN_MINUTES,
} from "~/utils/tokens.server";
import { prisma } from "~/utils/db.server";
import { sessionStorage } from "./session.server";

class RedirectError extends Error {
  response: Response;
  constructor(response: Response) {
    super("Redirect initiated");
    this.response = response;
  }
}

export async function requireAuth(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );
  const userId = session.get("userId");

  if (!userId) {
    throw new RedirectError(redirect("/login"));
  }

  try {
    let accessToken = session.get("accessToken");
    const tokenExpiresAt = session.get("tokenExpiresAt");
    if (!accessToken || !tokenExpiresAt || Date.now() > tokenExpiresAt) {
      accessToken = await getValidAccessToken(request);
      session.set("accessToken", accessToken);
      session.set(
        "tokenExpiresAt",
        Date.now() + ACCESS_TOKEN_EXPIRES_IN_MINUTES * 60 * 1000,
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    return { user, accessToken };
  } catch (error) {
    console.error("Auth error:", error);
    throw new RedirectError(redirect("/login"));
  }
}
