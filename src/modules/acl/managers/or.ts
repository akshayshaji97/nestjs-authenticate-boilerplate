import { OrAuthorizationConfig, AuthResponse } from '../interfaces';
import authorize from '../helpers/authorize';
import { UserPermission } from '../schemas/user-permissions.schema';

const handler = (
  userData: UserPermission,
  authorizationConfig: OrAuthorizationConfig,
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

  for (const item of authorizationConfig.items) {
    authorizationData = authorize(userData, item);
    if (authorizationData && authorizationData.isAuthorized) {
      return { ...authorizationData };
    }
  }

  return { isAuthorized: false };
};

export default handler;
