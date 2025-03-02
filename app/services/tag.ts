import { prisma } from "~/utils/db.server";

export type Tag = {
  id: string;
  name: string;
};

export type ActionResponse = {
  tag?: Tag;
  success: boolean;
  error?: string;
};

export const loadAllTags = async () => {
  try {
    const allTags = await prisma.tag.findMany();
    return Response.json({ tags: allTags, success: true });
  } catch (error) {
    return Response.json({ error, success: false });
  }
};

export const deleteTagAction = async (request: Request) => {
  const formData = await request.formData();
  const tagId = String(formData.get("id"));
  try {
    await prisma.tag.update({
      where: { id: tagId },
      data: { posts: { disconnect: [] } },
    });
    await prisma.tag.delete({ where: { id: tagId } });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to delete tag" });
  }
};

export const createTagAction = async (request: Request) => {
  const formData = await request.formData();
  const tagName = String(formData.get("tag-name"));
  const existingTag = await prisma.tag.findFirst({ where: { name: tagName } });

  if (existingTag) {
    return Response.json({ error: "Tag already exists", success: false });
  }

  try {
    const createdTag = await prisma.tag.create({ data: { name: tagName } });
    return Response.json({ tag: createdTag, success: true });
  } catch (error) {
    return Response.json({ error: "Failed to create tag", success: false });
  }
};
