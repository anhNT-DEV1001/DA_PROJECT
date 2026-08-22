import { UserResponse } from 'src/modules/users/dtos';

export class LoginDto {
  username: string;
  password: string;
}

export class LoginResponse {
  user: UserResponse;
  token: {
    accessToken: string;
    refreshToken: string;
    sessionId: string;
  };
}
