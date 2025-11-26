import { Injectable, NotFoundException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(credentials: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findByUsername(credentials.username);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const passwordValid = await this.comparePassword(
      credentials.password,
      user.password
    );
    if (!passwordValid) {
      throw new NotFoundException("Invalid password");
    }
    const payload = { sub: user._id, email: user.email };
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

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(email);
    if (!user) return null;
    const passwordValid = await this.comparePassword(password, user.password);
    if (!passwordValid) return null;
    const { password: _, ...result } = user;
    return result;
  }
}
