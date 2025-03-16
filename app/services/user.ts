export type UserProfile = {
  firstName: string;
  lastName: string;
  photoLink: string | null;
};

type Role = "ADMIN" | "READER" | "AUTHOR";

type Token = {
  id: string;
  accessToken?: string;
  refreshToken?: string;
  createdAt: Date;
  expiresAt: Date;
};

export type User = {
  id: string;
  email: string;
  createdAt: string;
  role: Role;
  profile: UserProfile | null;
  tokens: Token[];
};
