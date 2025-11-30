import { IsEmail, IsEnum, IsString, Matches } from "class-validator";
import { PASSWORD_REGEX } from "../../constant";
import { UserRole } from "../../enums/user-role.enum";

export class SignupRequestDto {
  @IsEmail({}, { message: "Email non valida" })
  email!: string;

  @IsString({ message: "Password non valida" })
  @Matches(PASSWORD_REGEX, {
    message: "Password troppo debole",
  })
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}
