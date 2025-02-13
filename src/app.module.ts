import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ResourcesModule } from './resources/resources.module';
import { MoviesModule } from './resources/movies/movies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './resources/entities/movie.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
        }),
        ResourcesModule,
        MoviesModule,
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'db/movies.sqlite',
            entities: [Movie],
            synchronize: true, // No usar en producción
        }),
    ],
})
export class AppModule implements NestModule {
    configure() {
    }
}