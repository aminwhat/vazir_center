import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import * as clc from 'cli-color';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { NotFoundExceptionFilter } from './common/notfound.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new NotFoundExceptionFilter());

  app.use(helmet());
  app.use(morgan('tiny'));
  app.use(cookieParser());

  const port: string = process.env.PORT;
  await app.listen(port, () => {
    console.log('\n' + clc.bgCyan('Running on port: ' + port) + '\n');
  });
}

dotenv.config();

bootstrap();
