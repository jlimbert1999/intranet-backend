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
  use(req: Request, res: Express.Response, next: () => void) {}
}
