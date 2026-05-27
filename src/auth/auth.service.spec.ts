const PASSWORD_HASH =
  'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3';

const mockUsers = [
  {
    id: 1,
    username: 'john_doe',
    isAdmin: false,
    isActive: true,
    password: PASSWORD_HASH,
  },
  {
    id: 2,
    username: 'admin_user',
    isAdmin: true,
    isActive: true,
    password: PASSWORD_HASH,
  },
];

jest.mock('../users/users.controller', () => ({
  users: mockUsers,
}));

import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const service = new AuthService(new JwtService({ secret: 'my_secret_key' }));

  it('should return an access token for valid credentials', () => {
    const result = service.login('john_doe', '123');

    expect(result.access_token).toBeDefined();
    expect(typeof result.access_token).toBe('string');
  });

  it('should throw UnauthorizedException for a wrong password', () => {
    expect(() => service.login('john_doe', 'wrong')).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException for an unknown user', () => {
    expect(() => service.login('unknown', '123')).toThrow(
      UnauthorizedException,
    );
  });
});
