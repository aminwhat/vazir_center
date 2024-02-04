import { Module } from '@nestjs/common';
import { HessabdbModule } from './hessabdb/hessabdb.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { HessabModule } from './hessab/hessab.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PRODUCTION: Joi.boolean().default('true'),
        PORT: Joi.number().default(3779),
        SECRET: Joi.string().default('averylogphrasebiggerthanthirtytwochars'),
        DB_CONNECTION_STRING: Joi.string().default('mongodb://localhost:27117'),
      }),
    }),
    MongooseModule.forRoot(process.env.DB_CONNECTION_STRING, {
      connectionName: 'hessab',
      dbName: 'hessab',
      authMechanism: Boolean(process.env.PRODUCTION) ? null : 'DEFAULT',
    }),
    HessabdbModule,
    ApiModule,
    HessabModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
