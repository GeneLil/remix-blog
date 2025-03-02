import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import {
  redirect,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { getUser } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import type { Tag } from "~/services/tag";

export type Post = {
  id: string;
  title: string;
  body: string;
  authorId: string;
  photoLink: string;
  tags: Tag[];
  comments: string[];
  likes: string[];
};

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_IMAGE_SIZE = 5_000_000;

export const postValidator = withZod(
  z.object({
    title: z.string().min(1, { message: "Title is required" }),
    body: z.string().min(1, { message: "Body is required" }),
    tags: z.array(z.string()),
    image: z
      .any()
      .refine((file) => !!file, { message: "Image is required." })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
        message: ".jpg, .jpeg, .png and .webp files are accepted.",
      })
      .refine((file) => file?.size <= MAX_IMAGE_SIZE, {
        message: `Max file size is 5MB.`,
      }),
  }),
);

export const createPost = async (request: Request) => {
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: MAX_IMAGE_SIZE,
      file: ({ filename }) => {
        const extname = filename.split(".").pop();
        return `${Date.now()}.${extname}`;
      },
      directory: "./public/uploads",
    }),
    unstable_createMemoryUploadHandler(),
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler,
  );

  const result = await postValidator.validate(formData);

  if (result.error) {
    return validationError(result.error);
  }

  const { title, body, image, tags } = result.data;

  try {
    const user = await getUser(request);
    if (user) {
      const post = await prisma.post.create({
        data: {
          authorId: user.id,
          title,
          body,
          photoLink: image ? image.name : "",
        },
      });
      if (tags.length > 0) {
        await prisma.post.update({
          where: { id: post.id },
          data: {
            tags: {
              connect: tags.map((tagId) => ({ id: tagId })),
            },
          },
          include: { tags: true },
        });
      }

      return redirect("/posts");
    }
  } catch (error) {
    return Response.json({ status: "error", error });
  }
};
