export interface JwtAccessPayload {
  sub: string;
  email: string | null;
}

export interface JwtRefreshPayload {
  sub: string;
  family: string;
  jti: string;
}
