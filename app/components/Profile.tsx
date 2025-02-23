import { useFetcher } from "@remix-run/react";
import { useState } from "react";

export default function Profile({ user }) {
  const fetcher = useFetcher();
  const [imageUrl, setImageUrl] = useState(user.imageUrl || "");

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("imageUrl", imageUrl);
    fetcher.submit(formData, { method: "post", action: "/api/user" });
  }

  return (
    <div>
      <h2>Профиль</h2>
      {user.imageUrl && <img src={user.imageUrl} alt="User Avatar" />}
      <form onSubmit={handleSubmit}>
        <input
          type="image"
          alt="User Avatar"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button type="submit">Обновить фото</button>
      </form>
    </div>
  );
}
