import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import type { Request, Response } from 'express';
import { AuthGuard } from './guards/auth/auth.guard';
import { LoginDto } from './dtos';
import { ConfigService } from '@nestjs/config';
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
}
