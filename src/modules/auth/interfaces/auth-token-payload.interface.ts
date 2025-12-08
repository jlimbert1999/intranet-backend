export class DirectLoginResult {
  ok: true;
  accessToken: string;
  refreshToken: string;
}

export class AccessTokenPayload {
  sub: string;
  externalKey: string;
  clientKey: string;
}

export class RefreshTokenPayload {
  sub: string;
  clientKey: string;
}
