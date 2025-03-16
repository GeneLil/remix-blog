export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const imageUrl = url.searchParams.get("url");

  if (!imageUrl) {
    return new Response("No URL provided", { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    const imageBlob = await response.blob();
    return new Response(imageBlob, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (e) {
    return new Response("Failed to fetch image", { status: 500 });
  }
};
