import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "auth_session",
    secure: process.env.NODE_ENV === "production",
    secrets: ["super-secret-key"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

export async function getSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}
