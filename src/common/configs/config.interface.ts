export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  security: SecurityConfig;
  // swagger: SwaggerConfig;
}

export interface NestConfig {
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
}

// export interface SwaggerConfig {
//   enabled: boolean;
//   title: string;
//   description: string;
//   version: string;
//   path: string;
// }
