import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginOkDto } from "@reservation-app/shared";
import * as bcrypt from "bcrypt";
import {
  UserWithIdAndWithoutPassword,
  UserWithoutPassword,
} from "src/users/types/user";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(user: UserWithIdAndWithoutPassword): Promise<LoginOkDto> {
    const payload = { sub: user._id, email: user.email, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async validateUser(
    email: string,
    password: string
  ): Promise<UserWithoutPassword> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const passwordValid = await this.comparePassword(password, user.password);
    if (!passwordValid) return null;
    const { password: _, ...result } = user.toObject();
    return { ...result, _id: user._id.toString() };
  }
}
