export type UserProfile = {
  firstName: string;
  lastName: string;
  photoLink?: string;
};

type Role = "ADMIN" | "READER" | "AUTHOR";

export type User = {
  id: string;
  email: string;
  role: Role;
  profile: UserProfile;
};

export class UserProfileClass {
  static async updateProfile(userId: string) {}
  static async createProfile(userId: string) {}
}

export class UserClass {
  static async updateProfile(userId: string) {}
}
