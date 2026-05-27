import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

export interface User {
  id: number;
  username: string | null | undefined;
  isAdmin: boolean | null | undefined;
  isActive: boolean | null | undefined;
}

export const users: User[] = [
  { id: 1, username: 'john_doe', isAdmin: false, isActive: true },
  { id: 2, username: 'admin_user', isAdmin: true, isActive: true },
  { id: 3, username: 'inactive_user', isAdmin: false, isActive: false },
];

@Controller('users')
export class UsersController {
  constructor() {}

  @Get()
  @ApiQuery({
    name: 'filter',
    required: false,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
  })
  @ApiOperation({
    summary: 'Get all users with optional filtering and sorting',
  })
  findAll(
    @Query('filter') filter?: string,
    @Query('sort') sort?: string,
  ): User[] {
    console.log(`Filter: ${filter}, Sort: ${sort}`);

    let result = [...users];

    if (filter) {
      const [key, value] = filter.split(':');
      result = result.filter((user) => String(user[key]) === value);
    }

    if (sort) {
      const [key, order] = sort.split(':');
      result.sort((a, b) => {
        if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user by ID',
  })
  findOne(@Param() params: Record<string, string>): User | undefined {
    const user = users.find((user) => user.id === Number(params.id));
    return user;
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
  })
  create(@Body() userData: Omit<User, 'id'>): User {
    const newUser: User = {
      id: users.length + 1,
      ...userData,
    };

    users.push(newUser);

    return newUser;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Replace a user by ID',
  })
  replace(
    @Param() params: Record<string, string>,
    @Body() userData: Partial<Omit<User, 'id'>>,
  ): User | undefined {
    const user = users.find((user) => user.id === Number(params.id));

    if (user) {
      Object.assign(user, {
        username: userData.username ?? null,
        isAdmin: userData.isAdmin ?? null,
        isActive: userData.isActive ?? null,
      });

      return user;
    }
  }

  @Patch(':id/is-active')
  @ApiOperation({
    summary: 'Update the isActive status of a user by ID',
  })
  updateIsActive(
    @Param() params: Record<string, string>,
    @Body() userData: Pick<User, 'isActive'>,
  ): User | undefined {
    const user = users.find((user) => user.id === Number(params.id));

    if (user) {
      user.isActive = userData.isActive;
      return user;
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a user by ID',
  })
  delete(@Param() params: Record<string, string>) {
    const index = users.findIndex((user) => user.id === Number(params.id));

    if (index !== -1) {
      users.splice(index, 1);
    }
  }
}
