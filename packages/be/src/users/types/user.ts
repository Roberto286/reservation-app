import { User } from "src/schemas/user.schema";

export type UserWithoutPassword = Omit<User, "password"> | null;
export type UserWithIdAndWithoutPassword = Omit<User, "password"> & {
  _id: string;
};
