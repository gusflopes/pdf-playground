import type { Config } from './config.interface';

const config: Config = {
  nest: {
    port: 3333,
  },
  cors: {
    enabled: true,
  },
  // swagger: {
  //   enabled: true,
  //   title: 'Nestjs FTW',
  //   description: 'The nestjs API description',
  //   version: '1.5',
  //   path: 'api',
  // },
  security: {
    expiresIn: '30m',
    refreshIn: '1d',
    bcryptSaltOrRound: 10,
  },
};

export default (): Config => config;
