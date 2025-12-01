import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}
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
}
