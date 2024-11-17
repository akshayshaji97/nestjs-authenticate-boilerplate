import { SetMetadata } from '@nestjs/common';
import { AclConfig, AuthorizationConfig } from '../interfaces';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const Role = (role: string): AuthorizationConfig => ({
  authenticationManager: 'role',
  role,
});

export const Permission = (permission: string): AuthorizationConfig => ({
  permission,
  authenticationManager: 'permission',
});

export const And = (...items: AuthorizationConfig[]): AuthorizationConfig => ({
  authenticationManager: 'and',
  items,
});

export const Or = (...items: AuthorizationConfig[]): AuthorizationConfig => ({
  authenticationManager: 'or',
  items,
});

export const Authorize = (
  config?:
    | AclConfig
    | { resolveFromToken?: boolean; authenticationManager?: string },
) => {
  const {
    resolveFromToken = true,
    authenticationManager = 'authenticate',
    ...rest
  } = config || {};
  return SetMetadata('acl', {
    ...rest,
    authenticationManager,
    resolveFromToken,
  });
};
