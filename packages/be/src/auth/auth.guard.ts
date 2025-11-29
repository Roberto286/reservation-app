import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    await this.validateRequest(request);
    return true;
  }

  private async validateRequest(request: Request): Promise<void> {
    const token = this.extractBearerToken(request);
    if (!token) {
      throw new UnauthorizedException("Missing bearer token");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }

  private extractBearerToken(request: Request): string | undefined {
    const rawHeader = request.headers.authorization;
    const authorization = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
    if (!authorization) {
      return undefined;
    }

    const [type, ...rest] = authorization.trim().split(/\s+/);
    if (type?.toLowerCase() !== "bearer") {
      return undefined;
    }

    const token = rest.join(" ").trim();
    return token.length ? token : undefined;
  }
}
