import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { AdminModule } from './admin/admin.module';
import { V0Module } from './v0/v0.module';
import * as dotenv from 'dotenv';
dotenv.config();

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
        PORT: Joi.number().default(3779),
        SECRET: Joi.string().default('averylogphrasebiggerthanthirtytwochars'),
        DB_CONNECTION_STRING: Joi.string().default('mongodb://localhost:27117'),
        DB_COMPANY_NAME: Joi.string().default('hessab'),
        PRODUCTION: Joi.boolean().default('true'),
      }),
    }),
    MongooseModule.forRoot(process.env.DB_CONNECTION_STRING, {
      connectionName: 'hessab',
      dbName: process.env.DB_COMPANY_NAME,
      authMechanism: Boolean(process.env.PRODUCTION) ? null : 'DEFAULT',
    }),
    DbModule,
    ApiModule,
    AdminModule,
    V0Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
