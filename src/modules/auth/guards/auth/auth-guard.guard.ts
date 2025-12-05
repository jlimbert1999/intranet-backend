import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth.service';

@Injectable()
export class AuthGuardGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    const access = req.cookies?.['intranet_access'] as string | undefined;
    const refresh = req.cookies?.['intranet_refresh'] as string | undefined;

    // console.log(access, refresh);

    // console.log('🔍 Guard - Verificando autenticación...');
    // console.log('Access Token presente:', !!access);
    // console.log('Refresh Token presente:', !!refresh);

    // ========================================
    // CASO 1: Hay Access Token - Validarlo
    // ========================================
    if (access) {
      try {
        const payload: unknown = this.jwtService.verify(access);
        req['user'] = payload;
        // console.log('✅ Access token válido para toekn', payload);
        return true;
      } catch (error) {
        console.log('⚠️ Access token inválido/expirado:');
        console.log(error);
      }
    }

    // 1. Si NO hay access token → intentar refresh
    if (!access) {
      return await this.handleRefresh(refresh, req, res);
    }

    // 2. Verificar access token
    try {
      const payload: unknown = this.jwtService.verify(access);
      req['user'] = payload;
      // console.log('✅ Access token válido para toekn', payload);
      return true; // access válida
    } catch (err) {
      // Si expiró o es inválida → refrescar
      return await this.handleRefresh(refresh, req, res);
    }
  }

  private async handleRefresh(refresh: string | undefined, req: Request, res: Response): Promise<boolean> {
    if (!refresh) throw new UnauthorizedException('Sesión expirada');

    try {
      const { accessToken, refreshToken } = await this.authService.refreshTokens(refresh);

      res.cookie('intranet_access', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
      });

      res.cookie('intranet_refresh', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
      });

      // Ahora sí → acceso permitido
      return true;
    } catch (err) {
      console.error('❌ Refresh falló:', err);
      res.clearCookie('intranet_access');
      res.clearCookie('intranet_refresh');
      throw new UnauthorizedException('No se pudo refrescar la sesión');
    }
  }
}
