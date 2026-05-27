import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'node:crypto';
import { users } from '../users/users.controller';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(username: string, password: string): { access_token: string } {
    const user = users.find((u) => u.username === username);

    if (
      !user ||
      user.password !== createHash('sha256').update(password).digest('hex')
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.id, isAdmin: user.isAdmin };

    return { access_token: this.jwtService.sign(payload) };
  }
}
