import { PermissionAuthorizationConfig, AuthResponse } from '../interfaces';
import { UserPermission } from '../schemas/user-permissions.schema';

const handler = (
  userData: UserPermission,
  authorizationConfig: PermissionAuthorizationConfig,
): AuthResponse => {
  if (
    !userData ||
    !userData.apiPermissions ||
    !authorizationConfig ||
    !authorizationConfig.permission
  ) {
    return { isAuthorized: false };
  }

  if (userData.apiPermissions[authorizationConfig.permission]) {
    return { isAuthorized: true, permission: authorizationConfig.permission };
  }

  return { isAuthorized: false };
};

export default handler;
