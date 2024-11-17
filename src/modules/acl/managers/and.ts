import authorize from '../helpers/authorize';
import { AndAuthorizationConfig, AuthResponse } from '../interfaces';
import { UserPermission } from '../schemas/user-permissions.schema';

const handler = (
  userData: UserPermission,
  authorizationConfig: AndAuthorizationConfig,
): AuthResponse => {
  if (
    !authorizationConfig ||
    !authorizationConfig.items ||
    !Array.isArray(authorizationConfig.items) ||
    authorizationConfig.items.length === 0
  ) {
    return { isAuthorized: false };
  }
  let authorizationData: AuthResponse | undefined;

  for (const configItem of authorizationConfig.items) {
    authorizationData = authorize(userData, configItem);
    if (!authorizationData || !authorizationData.isAuthorized) {
      return { isAuthorized: false };
    }
  }

  return { isAuthorized: true };
};

export default handler;
