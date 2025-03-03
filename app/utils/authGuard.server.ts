import { redirect } from "@remix-run/node";
import { getUser } from "~/utils/auth.server";

export async function requireAuth(request: Request) {
  const user = await getUser(request);

  if (!user) {
    throw redirect("/login");
  }

  return user;
}
