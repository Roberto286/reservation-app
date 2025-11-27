import { Body, Controller, Post } from "@nestjs/common";
import { SignupResponseDto } from "./dto/signup-response.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("signup")
  async signup(
    @Body() body: { email: string; password: string }
  ): Promise<SignupResponseDto> {
    const user = await this.usersService.createUser(body.email, body.password);
    return { id: user._id, email: user.email };
  }
}
