import { UserLoginGuard } from './user-login.guard';

describe('UserLoginGuard', () => {
  it('should be defined', () => {
    expect(new UserLoginGuard()).toBeDefined();
  });
});
