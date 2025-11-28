import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import type { Request, Response } from 'express';
import { AuthGuardGuard } from './guards/auth/auth-guard.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('callback')
  async callback(@Query('code') code: string, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.handleOAuthCallback(code);
    const { accessToken, refreshToken, user } = data;

    res.cookie('sso_access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('sso_refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.redirect('http://localhost:4200/admin');
  }

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }

  @Get('me')
  @UseGuards(AuthGuardGuard)
  async me(@Req() req: Request) {
    // Aquí ya tienes req.user proveniente del access_token del IdentityHub
    const identityId = req['user'] as any; // "sub" = user.id del IdentityHub
    console.log(identityId);

    // Ahora buscar el "shadow user" local de este sistema

    return {
      ok: true,
      user: 'user',
    };
  }
}
