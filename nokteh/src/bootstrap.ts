import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import * as clc from 'cli-color';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(morgan('tiny'));
  app.use(cookieParser());

  const port: string = process.env.PORT;
  await app.listen(port, () => {
    console.log('\n' + clc.bgCyan('Running on port: ' + port) + '\n');
  });
}
