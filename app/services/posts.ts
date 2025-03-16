import type { Tag } from "~/services/tag";
import type { User } from "~/services/user";
import { zfd } from "zod-form-data";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export type Comment = {
  id: string;
  body: string;
  author: User;
  post: Post;
  createdAt: string;
};

export type Post = {
  id: string;
  title: string;
  body: string;
  author: User;
  authorId: string;
  photoLink: string;
  tags: Tag[];
  comments: Comment[];
  likes: string[];
  createdAt: string;
  modifiedAt: string;
};

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const MAX_IMAGE_SIZE = 5_000_000;

export const postValidator = withZod(
  zfd.formData({
    title: z.string().min(1, { message: "Title is required" }),
    body: z.string().min(1, { message: "Body is required" }),
    tags: zfd.repeatable().optional(),
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
