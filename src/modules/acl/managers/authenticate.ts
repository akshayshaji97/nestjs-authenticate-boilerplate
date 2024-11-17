import { AuthenticateAuthorizationConfig, AuthResponse } from '../interfaces';
import { UserPermission } from '../schemas/user-permissions.schema';

const handler = (
  userData: UserPermission,
  authorizationConfig: AuthenticateAuthorizationConfig,
): AuthResponse => {
  return { isAuthorized: true };
};

export default handler;
