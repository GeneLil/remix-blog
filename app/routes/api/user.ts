import { json } from "@remix-run/node";
import { requireAuth } from "~/utils/authGuard.server";
import { prisma } from "~/utils/db.server";

export async function loader({ request }: { request: Request }) {
  const user = await requireAuth(request);
  return json({ user });
}

export async function action({ request }: { request: Request }) {
  const user = await requireAuth(request);
  const formData = await request.formData();
  const imageUrl = formData.get("imageUrl");

  if (!imageUrl) {
    return json({ error: "Image URL is required" }, { status: 400 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { imageUrl },
  });

  return json({ user: updatedUser });
}
