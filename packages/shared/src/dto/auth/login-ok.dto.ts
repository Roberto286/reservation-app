import { UserRole } from "../../enums/user-role.enum";

export class LoginOkDto {
  access_token!: string;
  userId!: string;
  userRole!: UserRole;
}
