import { JwtguardGuard } from './jwtguard.guard';

describe('JwtguardGuard', () => {
  it('should be defined', () => {
    expect(new JwtguardGuard()).toBeDefined();
  });
});
