import { HeaderSmall } from "~/components/Typography";
import { useLoaderData } from "@remix-run/react";
import { type Tag, loadAllTags } from "~/services/tag";
import { FormCheckboxGroup } from "~/components/FormCheckboxGroup";
import { useState } from "react";
import { ImageUploader } from "~/components/ImageUploader";
import { ValidatedForm, validationError } from "remix-validated-form";
import { FormInput } from "~/components/FormInput";
import { FormTextarea } from "~/components/FormTextarea";
import { requireAuth } from "~/utils/authGuard.server";
import { getUser } from "~/utils/auth.server";
import {
  redirect,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { prisma } from "~/utils/db.server";
import { postValidator, MAX_IMAGE_SIZE } from "~/services/posts";

type LoaderData = {
  tags?: Tag[];
  success: boolean;
  error?: string;
};

export const action = async ({ request }: { request: Request }) => {
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

  const user = await getUser(request);
  try {
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

export const loader = async ({ request }: { request: Request }) => {
  await requireAuth(request);
  return await loadAllTags();
};

export default function CreatePost() {
  const { tags } = useLoaderData<LoaderData>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagSelection = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => tagId !== id));
      return;
    }
    setSelectedTags([...selectedTags, tagId]);
  };

  return (
    <div className="max-w-screen-xl w-1/2 flex flex-wrap flex-col gap-8 items-center justify-center mx-auto p-4">
      <ValidatedForm
        id="create-post-form"
        method="POST"
        validator={postValidator}
        encType="multipart/form-data"
        className="w-[800px]"
      >
        <div className="mb-5">
          <FormInput id="title" label="Title" name="title" type="text" />
        </div>
        <div className="mb-5">
          <FormTextarea id="body" label="Body" name="body" />
        </div>
        <div className="mb-5">
          <HeaderSmall>Apply tags:</HeaderSmall>
          <div className="w-full flex flex-wrap gap-2">
            {tags?.length ? (
              <FormCheckboxGroup
                items={tags}
                onChange={handleTagSelection}
                checkedTags={selectedTags}
                name="tags"
              />
            ) : (
              "No tag is created yet"
            )}
          </div>
        </div>
        <div className="mb-5">
          <ImageUploader name="image" label="Post image" defaultImage="" />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Create
        </button>
      </ValidatedForm>
    </div>
  );
}
