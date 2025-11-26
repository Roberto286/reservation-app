import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request as ExpressRequest } from "express";
import { UserWithIdAndWithoutPassword } from "src/users/types/user";
import { AuthService } from "./auth.service";

interface RequestWithUser extends ExpressRequest {
  user: UserWithIdAndWithoutPassword;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard("local"))
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }
}
