import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { lastValueFrom } from 'rxjs';
import { LoginDto } from './dtos';
import type { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config';
import { AuthTokenPayload } from './interfaces';

interface AuthSSOPayload {
  sub: string;
  externalKey: string;
  clientId: string;
}
@Injectable()
export class AuthService {
  private readonly IDENTITY_HUB_URL: string;
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService<EnvironmentVariables>,
  ) {
    this.IDENTITY_HUB_URL = this.configService.getOrThrow('IDENTITY_HUB_URL');
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async checkAuthStatus(payload: AuthSSOPayload) {
    const user = await this.userRepository.findOne({ where: { externalKey: payload.externalKey } });
    console.log(user);
    return user;
  }

  async handleOAuthCallback(code: string): Promise<any> {
    const response = await lastValueFrom(
      this.httpService.post('http://localhost:8000/auth/exchange', {
        code,
        client_id: 'intranet',
      }),
    );
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
    try {
      const request = this.httpService.post<{ accessToken: string; refreshToken: string }>(
        'http://localhost:8000/auth/refresh',
        {
          refreshToken,
          client_id: 'intranet',
        },
        { timeout: 5000 },
      );
      const res = await lastValueFrom(request);

      return {
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async login(loginDto: LoginDto, response: Response) {
    // try {
    //   const result = await this.httpService.post<AuthTokenPayload>(this.IDENTITY_HUB_URL, {
    //     ...loginDto,
    //     clientKey: 'intranet',
    //   });
    //   const { su } = result.data;
    //   // SET COOKIES HTTPONLY
    //   response.cookie('intranet_access', accessToken, {
    //     httpOnly: true,
    //     secure: false,
    //     sameSite: 'lax',
    //     maxAge: 15 * 60 * 1000,
    //   });
    //   response.cookie('intranet_refresh', refreshToken, {
    //     httpOnly: true,
    //     secure: false,
    //     sameSite: 'lax',
    //     maxAge: 7 * 24 * 60 * 60 * 1000,
    //   });
    //   // Devolver usuario
    //   return { user };
    // } catch (error: unknown) {
    //   if(error.inst)
    // }
  }
}
