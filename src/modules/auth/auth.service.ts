import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { lastValueFrom } from 'rxjs';
import { LoginDto } from './dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config';
import { RefreshTokenResult, DirectLoginResult } from './interfaces';
import { AxiosError } from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  async handleOAuthCallback(code: string): Promise<any> {
    console.log(code);
    const response = await lastValueFrom(
      this.httpService.post('http://localhost:8000/auth/exchange', {
        code,
        client_id: 'intranet',
      }),
    );
    console.log(response.data);
    return response.data;
  }

  async refreshToken(refreshToken: string) {
    try {
      const request = this.httpService.post<{ accessToken: string; refreshToken: string }>(
        'http://localhost:8000/auth/refresh',
        {
          refreshToken,
          client_id: 'intranet',
        },
      );
      return await lastValueFrom(request);
    } catch (error) {
      console.log('Refresh failed', error);
      throw new UnauthorizedException();
    }
  }

  async refreshTokens(refreshToken: string) {
    const authRefreshUrl = `${this.configService.get('IDENTITY_HUB_URL')}/auth/refresh`;
    const request = this.httpService.post<RefreshTokenResult>(authRefreshUrl, { refreshToken }, { timeout: 5000 });
    const result = await lastValueFrom(request);
    return result.data;
  }

  async login({ login, password }: LoginDto) {
    try {
      const authUrl = `${this.configService.get('IDENTITY_HUB_URL')}/auth/direct-login`;

      const result = await lastValueFrom(
        this.httpService.post<DirectLoginResult>(authUrl, { login, password, clientKey: 'intranet' }),
      );
      const { accessToken, refreshToken } = result.data;
      console.log(result.data);
      return { accessToken, refreshToken, ok: true, message: 'Logged in successfully' };
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        const message = (error.response.data['message'] as string) ?? 'Invalid credentials';
        throw new UnauthorizedException(message);
      }
      throw new InternalServerErrorException('Login can"t be completed at the moment');
    }
  }

  buildAuthorizeUrl(): string {
    const idp: string = this.configService.getOrThrow('IDENTITY_HUB_URL');
    const clientId: string = this.configService.getOrThrow('CLIENT_KEY');
    const redirect: string = this.configService.getOrThrow('CLIENT_REDIRECT');

    const url = new URL(`${idp}/auth/authorize`);
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('redirect_uri', redirect);
    url.searchParams.set('scope', 'openid profile email');
    return url.toString();
  }
}
