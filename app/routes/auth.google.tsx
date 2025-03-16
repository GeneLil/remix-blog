import { googleAuth } from "~/utils/auth.server";

export const loader = async ({ request }: { request: Request }) => {
  return await googleAuth.authenticate("google", request);
};

export const action = async ({ request }: { request: Request }) => {
  return await googleAuth.authenticate("google", request);
};
