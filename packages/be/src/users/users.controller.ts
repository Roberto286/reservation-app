import { Controller, Post, Body, BadRequestException } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  async register(@Body() body: { email: string; password: string }) {
    // Puoi aggiungere validazione qui
    const user = await this.usersService.createUser(body.email, body.password);
    return { id: user._id, email: user.email };
  }
}
