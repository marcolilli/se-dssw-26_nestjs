import { Injectable } from '@nestjs/common';
import { User, users } from './users.controller';

@Injectable()
export class UsersService {
  filterUsers(key: keyof User, filter: string | number | boolean): User[] {
    return users.filter((user) => {
      return user[key] === filter;
    });
  }
  sortUsers(key: keyof User, order: 'asc' | 'desc'): User[] {
    return users.sort((a, b) => {
      if (!a[key] || !b[key]) return 0;

      if (a[key] < b[key]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return order === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }
}
