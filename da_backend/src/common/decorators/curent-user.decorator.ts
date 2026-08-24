import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthUser } from 'src/modules/auth/dtos';

type AuthenticatedRequest = Request & {
  user?: AuthUser;
};

export const CurrentUser = createParamDecorator(
  (key: keyof AuthUser | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const currentUser = request.user;

    return key ? currentUser?.[key] : currentUser;
  },
);
