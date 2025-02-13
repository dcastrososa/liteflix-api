import { Module } from "@nestjs/common";
import { ThemeMovieModule } from "src/externalServices/themeMovie/themeMovie.module";
import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../entities/movie.entity';
import { UploadModule } from '../../common/services/upload.module';

@Module({
    imports: [
        ThemeMovieModule,
        TypeOrmModule.forFeature([Movie]),
        UploadModule,
    ],
    controllers: [MoviesController],
    providers: [MoviesService],
})
export class MoviesModule {}