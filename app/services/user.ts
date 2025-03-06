export type UserProfile = {
  firstName: string;
  lastName: string;
  photoLink: string | null;
};

type Role = "ADMIN" | "READER" | "AUTHOR";

export type User = {
  id: string;
  email: string;
  role: Role;
  profile: UserProfile | null;
};
