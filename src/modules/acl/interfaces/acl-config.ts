import { AuthorizationConfig } from './authorization-config';
export type AclConfig = AuthorizationConfig & { resolveFromToken?: boolean };
