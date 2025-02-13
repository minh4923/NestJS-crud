import {  registerAs } from '@nestjs/config';
export default registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET || 'access_token',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_token',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}));