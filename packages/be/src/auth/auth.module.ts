import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";
import { UsersService } from "src/users/users.service";

@Module({
  imports: [
    JwtModule.register({
      secret: "supersecretkey",
      signOptions: { expiresIn: "1h" },
    }),
    UsersModule,
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
