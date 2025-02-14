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
            database: process.env.NODE_ENV === 'production'
                ? '/tmp/db.sqlite'
                : 'db.sqlite',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
        })
    ],
})
export class AppModule implements NestModule {
    configure() {
    }
}