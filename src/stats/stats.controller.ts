import { Controller, Get } from '@nestjs/common';
import { users } from '../users/users.controller';

@Controller('stats')
export class StatsController {
  constructor() {}

  @Get()
  getStats(): Record<string, number> {
    return {
      totalUsers: users.length,
      adminUsers: users.filter((user) => user.isAdmin === true).length,
      activeUsers: users.filter((user) => user.isActive === true).length,
    };
  }
}
