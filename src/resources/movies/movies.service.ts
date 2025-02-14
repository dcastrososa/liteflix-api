import { BadRequestException, Injectable } from "@nestjs/common";
import { ThemeMovieService } from "src/externalServices/themeMovie/themeMovie.service";
import { imageConfiguration } from "src/externalServices/themeMovie/common/imageConfiguration";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { UploadService } from '../../common/services/upload.service';
import { CreateMovieInDto } from './dto/in/CreateMovie.in.dto';

@Injectable()
export class MoviesService {
    constructor(
        private readonly themeMovieService: ThemeMovieService,
        @InjectRepository(Movie)
        private moviesRepository: Repository<Movie>,
        private readonly uploadService: UploadService,
    ) { }

    async getNowPlaying(): Promise<Movie> {
        try {
            const { data: { results } } = await this.themeMovieService.getNowPlaying();
            const movie = results[2];
            return {
                id: movie.id,
                originalTitle: movie.original_title,
                posterUrl: `${imageConfiguration.baseUrl}${imageConfiguration.backdropSizes.w1280}${movie.backdrop_path}`
            }
        } catch (e) {
            console.error(e);
            throw new Error("Error getting now playing movies");
        }
    }

    async getPopular(): Promise<Movie[]> {
        try {
            const { data: { results } } = await this.themeMovieService.getPopular();
            return results.map((movie: any) => ({
                id: movie.id,
                originalTitle: movie.original_title,
                posterUrl: `${imageConfiguration.baseUrl}${imageConfiguration.backdropSizes.w1280}${movie.backdrop_path}`,
                voteAverage: Number(movie.vote_average.toFixed(1)),
                releaseDate: movie.release_date
            }));
        } catch (e) {
            console.error(e);
            throw new Error("Error getting popular movies");
        }
    }

    async createMovie(createMovieDto: CreateMovieInDto, file: Express.Multer.File): Promise<Movie> {
        try {
            const existingMovie = await this.moviesRepository.findOne({
                where: { originalTitle: createMovieDto.title }
            });
    
            if (existingMovie) {
                throw new Error('A movie with this title already exists');
            }
    
            const posterUrl = await this.uploadService.uploadImage(file);
    
            const movie = this.moviesRepository.create({
                originalTitle: createMovieDto.title,
                posterUrl,
                releaseDate: new Date().toISOString().split('T')[0],
                voteAverage: 0,
            });
    
            return this.moviesRepository.save(movie);
        } catch (e) {
            console.error(e);
            throw new BadRequestException("Error creating movie");
        }
    }

    async getMyMovies(): Promise<Movie[]> {
        try {
            const movies = await this.moviesRepository.find({
                order: {
                    releaseDate: 'DESC'
                }
            });
    
            return movies.map((movie) => ({
                id: movie.id,
                originalTitle: movie.originalTitle,
                posterUrl: movie.posterUrl,
                voteAverage: movie.voteAverage,
                releaseDate: movie.releaseDate
            }));
        } catch (e) {
            console.error(e);
            throw new Error("Error getting my movies");
        }
    }
}
