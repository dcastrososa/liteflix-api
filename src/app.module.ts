import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { ResourcesModule } from './resources/resources.module';
import { MoviesModule } from './resources/movies/movies.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
        }),
        ResourcesModule,
        MoviesModule,
        TypeOrmModule.forRoot({
            type: process.env.NODE_ENV === 'production' ? 'postgres' : 'sqlite',
            ...process.env.NODE_ENV === 'production' 
                ? {
                    url: process.env.DATABASE_URL,
                    ssl: {
                        rejectUnauthorized: false
                    },
                }
                : {
                    database: 'db.sqlite',
                },
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true, // Ten cuidado con esto en producción
        } as TypeOrmModuleOptions),
    ],
})
export class AppModule implements NestModule {
    configure() {
    }
}