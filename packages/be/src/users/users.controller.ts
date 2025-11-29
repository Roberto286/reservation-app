import { Body, Controller, Post } from "@nestjs/common";
import { SignupRequestDto } from "@reservation-app/shared";
import { SignupResponseDto } from "./dto/signup-response.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("signup")
  async signup(@Body() body: SignupRequestDto): Promise<SignupResponseDto> {
    const user = await this.usersService.createUser(body);
    return { id: user._id, email: user.email };
  }
}
