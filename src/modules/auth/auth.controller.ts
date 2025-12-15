import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { AuthGuard } from './guards/auth/auth.guard';
import { EnvironmentVariables } from 'src/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  @Get('login')
  login(@Res() response: Response, @Query('returnUrl') returnUrl: string) {
    console.log('🔐 GET /auth/login - Iniciando flujo OAuth');

    // Guardar returnUrl para después del callback
    // if (returnUrl) {
    //   response.cookie('return_url', returnUrl, {
    //     httpOnly: true,
    //     maxAge: 5 * 60 * 1000,
    //   });
    // }

    const authorizeUrl = this.authService.buildAuthorizeUrl();

    console.log(`➡️ Redirigiendo a: ${authorizeUrl.toString()}`);

    // ↓ REDIRECT 2: Backend Cliente → Identity Hub Backend
    return response.redirect(authorizeUrl);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Query('state') state: string, @Res() response: Response) {
    console.log(`✅ GET /auth/callback - code: ${code?.substring(0, 10)}...`);

    if (!code) {
      return response.status(400).send('Authorization code missing');
    }

    const tokens = await this.authService.handleOAuthCallback(code);
    console.log(tokens);

    // Guardar cookies del SP
    response.cookie('intranet_access', tokens.access_token, {
      httpOnly: true,
      sameSite: 'lax', // en dev
      secure: false, // en dev
      maxAge: 15 * 60 * 1000,
    });

    response.cookie('intranet_refresh', tokens.refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // Redirigir al frontend del SP
    console.log(state);
    // const redirectTo = state || 'http://localhost:4200/admin';
    return response.redirect('http://localhost:4200/admin');
  }

  @Get('status')
  @UseGuards(AuthGuard)
  checkAuthStatus(@Req() req: Request) {
    return { ok: true, user: req['user'] };
  }

  @Post('refresh')
  async refresh(@Req() request: Request, @Res() response: Response) {
    console.log("REFRESH INICIADO");
    const refreshToken = request.cookies?.['refresh_token'] as string | undefined;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    const tokens = await this.authService.refreshToken(refreshToken);
    response.cookie('intranet_access', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 15 * 60 * 1000,
    });

    response.cookie('intranet_refresh', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return response.json({ success: true });
  }
}
