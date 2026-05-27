import { UsersService } from './users.service';

describe('UsersService filter', () => {
  const usersService = new UsersService();

  it('should filter the users by username', () => {
    const result = usersService.filterUsers('username', 'john_doe');

    expect(result).toStrictEqual([
      { id: 1, username: 'john_doe', isAdmin: false, isActive: true },
    ]);
  });

  it('should filter the users by isAdmin', () => {
    const result = usersService.filterUsers('isAdmin', false);

    expect(result).toStrictEqual([
      { id: 1, username: 'john_doe', isAdmin: false, isActive: true },
      { id: 3, username: 'inactive_user', isAdmin: false, isActive: false },
    ]);
  });

  it('should return empty array if filter does not match any data', () => {
    const result = usersService.filterUsers('username', 'non_existent_user');

    expect(result).toStrictEqual([]);
  });
});

describe('UsersService sort', () => {
  const usersService = new UsersService();

  it('should sort users by id ascending', () => {
    const result = usersService.sortUsers('id', 'asc');

    expect(result.map((u) => u.id)).toStrictEqual([1, 2, 3]);
  });

  it('should sort users by id descending', () => {
    const result = usersService.sortUsers('id', 'desc');

    expect(result.map((u) => u.id)).toStrictEqual([3, 2, 1]);
  });

  it('should sort users by username ascending (alphabetical)', () => {
    const result = usersService.sortUsers('username', 'asc');

    expect(result.map((u) => u.username)).toStrictEqual([
      'admin_user',
      'inactive_user',
      'john_doe',
    ]);
  });

  it('should sort users by username descending (reverse alphabetical)', () => {
    const result = usersService.sortUsers('username', 'desc');

    expect(result.map((u) => u.username)).toStrictEqual([
      'john_doe',
      'inactive_user',
      'admin_user',
    ]);
  });
});
