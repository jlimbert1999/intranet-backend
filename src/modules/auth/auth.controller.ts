import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import type { Request, Response } from 'express';
import { AuthGuard } from './guards/auth/auth.guard';
import { LoginDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('callback')
  async callback(@Query('code') code: string, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.handleOAuthCallback(code);
    const { accessToken, refreshToken, user } = data;
    console.log(data);

    res.cookie('intranet_access', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('intranet_refresh', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.redirect('http://localhost:4200/admin');
  }

  @Get('status')
  @UseGuards(AuthGuard)
  checkAuthStatus(@Req() req: Request) {
    return req['user'] as any;
  }

  @Get('test')
  test(@Res() response: Response) {
    const authUrl = this.authService.buildAuthorizeUrl();
    return response.redirect(authUrl);
  }

  @Get('login')
  login(@Res() res: Response, @Query('returnUrl') returnUrl = '/admin') {
    const clientId = this.configService.ge('CLIENT_ID');
    const redirectUri = this.configService.get('REDIRECT_URI');
    const idpBase = this.configService.get('IDENTITY_HUB_URL');

    const authorizeUrl = new URL(`${idpBase}/auth/authorize`);
    authorizeUrl.searchParams.set('client_id', clientId);
    authorizeUrl.searchParams.set('redirect_uri', redirectUri);
    authorizeUrl.searchParams.set('response_type', 'code');
    authorizeUrl.searchParams.set('scope', 'openid profile email');
    authorizeUrl.searchParams.set('state', returnUrl); // opcional pero recomendado

    return res.redirect(authorizeUrl.toString());
  }
}
