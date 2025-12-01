import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

import { AuthService } from '../../auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}
  use(req: Request, res: Express.Response, next: () => void) {
    const accessToken = req.cookies['sso_access_token'];
    const refreshToken = req.cookies['sso_refresh_token'];
    if (!accessToken || !refreshToken) return next();
    this.authService.verifyToken(accessToken);

    let needsRefresh = !accessToken;

    if (!accessToken) {
      needsRefresh = true;
    } else {
      try {
        const decoded = this.jwtService.decode(accessToken) as any;
        const expiresIn = decoded.exp * 1000 - Date.now();

        // Refrescar si expira en menos de 5 minutos
        if (expiresIn < 5 * 60 * 1000) {
          needsRefresh = true;
        }
      } catch {
        needsRefresh = true;
      }
    }
  }
}
