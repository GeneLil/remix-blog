import type { User } from "~/services/user";
import { createContext, type ReactNode, useContext } from "react";

const UserContext = createContext<User | null>(null);

export const UserProvider = ({
  children,
  user,
}: {
  children: ReactNode;
  user: User;
}) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const useUserImage = (photoLink: string | null | undefined) => {
  if (!photoLink) return "";

  const isImageUploaded = photoLink
    ? /^\d+\.(jpg|jpeg|png|webp)$/i.test(photoLink)
    : false;

  if (isImageUploaded) {
    return `/avatars/${photoLink}`;
  }
  return `/proxy-image?url=${encodeURIComponent(photoLink)}`;
};
