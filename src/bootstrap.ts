import { NotFoundExceptionFilter } from './common/exceptions';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import * as clc from 'cli-color';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
// import * as passport from 'passport';
// import * as csurf from 'csurf';

export async function bootstrap(production: boolean): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    logger: production
      ? WinstonModule.createLogger({
          transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'logs/all.log' }),
            new winston.transports.File({
              level: 'debug',
              filename: 'logs/debug.log',
            }),
            new winston.transports.File({
              level: 'fatal',
              filename: 'logs/fatal.log',
            }),
            new winston.transports.File({
              level: 'log',
              filename: 'logs/log.log',
            }),
            new winston.transports.File({
              level: 'verbose',
              filename: 'logs/verbose.log',
            }),
            new winston.transports.File({
              level: 'error',
              filename: 'logs/error.log',
            }),
            new winston.transports.File({
              level: 'warn',
              filename: 'logs/warn.log',
            }),
          ],
        })
      : ['debug', 'error', 'fatal', 'log', 'verbose', 'warn'],
    abortOnError: !production,
  });

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new NotFoundExceptionFilter());

  app.use(helmet());
  app.use(morgan('tiny'));
  app.use(cookieParser());
  // app.use(
  //   csurf({
  //     cookie: true,
  //     sessionKey: 'AminWhat',
  //   }),
  // );
  // app.use(passport.initialize());
  // app.use(passport.session());

  const port = configService.get<string>('PORT', '3780');

  await app.listen(port, () => {
    console.log('\n' + clc.bgCyan('Running on port: ' + port) + '\n');
  });
}
