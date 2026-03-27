export interface LoginResponse {
  user: { id: string; name: string; email: string; role: string };
  tokens: { accessToken: string; refreshToken: string };
}