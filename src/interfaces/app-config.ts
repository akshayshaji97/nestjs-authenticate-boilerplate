export type Environment = 'development' | 'production';

export interface Appconfig {
  port: number | string;
  mongoUrl: string;
  jwt: JWTConfig;
  authentication: {
    liveOTP: boolean;
    debugOTP: string;
  };
}

interface JWTConfig {
  secret: string;
  accessSecret: string;
  refreshSecret: string;
  accessExpiry: number;
  refreshExpiry: number;
}
