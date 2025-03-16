import { googleAuth } from "~/utils/auth.server";
import { getSession, sessionStorage } from "~/utils/session.server";
import { redirect } from "@remix-run/node";

export const loader = async ({ request }: { request: Request }) => {
  const { user, tokensMap } = (await googleAuth.authenticate(
    "google",
    request,
  )) as {
    user: { id: string };
    tokensMap: {
      accessToken: string;
      tokenExpiresAt: number;
    };
  };

  const session = await getSession(request);

  session.set("userId", user.id);
  session.set("accessToken", tokensMap.accessToken);
  session.set("tokenExpiresAt", tokensMap.tokenExpiresAt);

  return redirect("/posts", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};
