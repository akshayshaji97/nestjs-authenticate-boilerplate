import { RoleAuthorizationConfig, AuthResponse } from '../interfaces';
import { UserPermission } from '../schemas/user-permissions.schema';

const handler = (
  userData: UserPermission,
  authorizationConfig: RoleAuthorizationConfig,
): AuthResponse => {
  if (
    !userData ||
    !userData.role ||
    !Array.isArray(userData.role) ||
    !authorizationConfig ||
    !authorizationConfig.role
  ) {
    return { isAuthorized: false };
  }

  if (userData.role.includes(authorizationConfig.role)) {
    return { isAuthorized: true, role: authorizationConfig.role };
  }

  return { isAuthorized: false };
};

export default handler;
