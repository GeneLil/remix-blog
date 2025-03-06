import { prisma } from "~/utils/db.server";
import { HeaderMiddle, HeaderSmall } from "~/components/Typography";
import { requireAuth } from "~/utils/authGuard.server";
import { useLoaderData } from "@remix-run/react";
import { MAX_IMAGE_SIZE, type Post, postValidator } from "~/services/posts";
import { ValidatedForm, validationError } from "remix-validated-form";
import { FormInput } from "~/components/FormInput";
import { FormTextarea } from "~/components/FormTextarea";
import { FormCheckboxGroup } from "~/components/FormCheckboxGroup";
import { ImageUploader } from "~/components/ImageUploader";
import { useState } from "react";
import type { Tag } from "~/services/tag";
import {
  redirect,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";

export const loader = async ({
  params,
  request,
}: {
  params: { id: string };
  request: Request;
}) => {
  await requireAuth(request);
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { tags: true, author: { include: { profile: true } } },
  });
  const allTags = await prisma.tag.findMany();

  return Response.json({ post, allTags });
};

export const action = async ({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) => {
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

  await prisma.post.update({
    where: {
      id: params.id,
    },
    data: {
      title,
      body,
      modifiedAt: new Date(),
      photoLink: image ? image.name : "",
      tags: {
        set: [],
        connect: tags ? tags.map((tagId) => ({ id: tagId })) : [],
      },
    },
  });
  return redirect("/posts");
};

const EditPostLayout = () => {
  const { post, allTags } = useLoaderData<{ post: Post; allTags: Tag[] }>();
  const tags = post.tags.map((tag) => tag.id);

  const [selectedTags, setSelectedTags] = useState<string[]>(tags);

  const handleTagSelection = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => tagId !== id));
      return;
    }
    setSelectedTags([...selectedTags, tagId]);
  };

  const { title, body, photoLink } = post;

  return (
    <div className="max-w-screen-xl flex flex-wrap flex-col gap-8 items-center justify-center mx-auto p-4">
      <HeaderMiddle>Edit post</HeaderMiddle>
      <ValidatedForm
        validator={postValidator}
        id="create-post-form"
        method="POST"
        encType="multipart/form-data"
        defaultValues={{
          title,
          body,
          image: photoLink,
          tags,
        }}
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
            {allTags.length ? (
              <FormCheckboxGroup
                items={allTags}
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
          <ImageUploader
            name="image"
            label="Post image"
            defaultImage={`/uploads/${photoLink}`}
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Update
        </button>
      </ValidatedForm>
    </div>
  );
};

export default EditPostLayout;
