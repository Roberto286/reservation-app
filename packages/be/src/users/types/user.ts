import { User } from "src/schemas/user.schema";

type UserWithId = User & { _id: string };

export type UserWithoutPassword = Omit<UserWithId, "password"> | null;
export type UserWithIdAndWithoutPassword = Omit<UserWithId, "password">;
