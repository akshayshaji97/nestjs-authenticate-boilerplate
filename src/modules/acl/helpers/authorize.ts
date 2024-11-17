import managers from '../managers';
import { AuthorizationConfig, AuthResponse } from '../interfaces';
import { UserPermission } from '../schemas/user-permissions.schema';

const getAuthData = (
  permissionData: UserPermission,
  authorizationConfig: AuthorizationConfig,
) => {
  if (!authorizationConfig) {
    return;
  }
  switch (authorizationConfig.authenticationManager) {
    case 'or':
      return managers.or(permissionData, authorizationConfig);
    case 'authenticate':
      return managers.authenticate(permissionData, authorizationConfig);
    case 'and':
      return managers.and(permissionData, authorizationConfig);
    case 'role':
      return managers.role(permissionData, authorizationConfig);
    case 'permission':
      return managers.permission(permissionData, authorizationConfig);
  }
};

const handler = (
  permissionData: UserPermission,
  authorizationConfig: AuthorizationConfig,
): AuthResponse | undefined => {
  if (!permissionData || !authorizationConfig) {
    return { isAuthorized: false };
  }
  const { authenticationManager } = authorizationConfig;
  if (
    !authenticationManager ||
    !managers[authenticationManager] ||
    typeof managers[authenticationManager] !== 'function'
  ) {
    return { isAuthorized: false };
  }

  const authData = getAuthData(permissionData, authorizationConfig);

  return authData;
};

export default handler;
