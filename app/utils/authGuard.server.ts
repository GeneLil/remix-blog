import { redirect } from "@remix-run/node";
import { getSession } from "./session.server";

export async function requireAuth(request: Request) {
  const session = await getSession(request);
  const userId = session.get("userId");

  if (!userId) {
    throw redirect("/login");
  }

  return userId;
}
