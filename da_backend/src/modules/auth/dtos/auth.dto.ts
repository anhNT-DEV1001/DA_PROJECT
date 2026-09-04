import { Permission, Role } from 'src/modules/admin/entites';
import { UserResponse } from 'src/modules/users/dtos';

export class AuthUser {
  user: UserResponse;
  roles: Role[];
  permissions: Permission[];
  token: {
    accessToken: string;
    sessionId: string;
  };
}

export class RefreshAuthUser {
  user: UserResponse;
  token: {
    refreshToken: string;
    sessionId: string;
  };
}
