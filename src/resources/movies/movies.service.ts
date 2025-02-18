import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { ThemeMovieService } from 'src/externalServices/themeMovie/themeMovie.service';
import { imageConfiguration } from 'src/externalServices/themeMovie/common/imageConfiguration';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { UploadService } from '../../common/services/upload.service';
import { CreateMovieInDto } from './dto/in/CreateMovie.in.dto';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { MovieDto } from './dto/out/Movie.out.dto';
import {
  MovieResponse,
  Movie as ExternalMovie,
} from 'src/externalServices/themeMovie/types/movie.types';

@Injectable()
export class MoviesService {
  constructor(
    private readonly themeMovieService: ThemeMovieService,
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    private readonly uploadService: UploadService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async getNowPlaying(): Promise<Omit<MovieDto, 'voteAverage' | 'releaseDate'>> {
    try {
      const { data } = (await this.themeMovieService.getNowPlaying()) as { data: MovieResponse };
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const movie = data.results[randomIndex];
      return {
        id: movie.id,
        originalTitle: movie.original_title,
        posterUrl: `${imageConfiguration.baseUrl}${imageConfiguration.backdropSizes.w1280}${movie.backdrop_path}`,
      };
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Error getting now playing movies');
    }
  }

  async getPopular(): Promise<Movie[]> {
    try {
      const { data } = (await this.themeMovieService.getPopular()) as { data: MovieResponse };
      return data.results.map((movie: ExternalMovie) => ({
        id: movie.id,
        originalTitle: movie.original_title,
        posterUrl: `${imageConfiguration.baseUrl}${imageConfiguration.backdropSizes.w1280}${movie.backdrop_path}`,
        voteAverage: Number(movie.vote_average.toFixed(1)),
        releaseDate: movie.release_date,
      }));
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Error getting popular movies');
    }
  }

  async createMovie(createMovieDto: CreateMovieInDto, file: Express.Multer.File): Promise<Movie> {
    try {
      const userUUID = this.request.headers['user-uuid'] as string;
      if (!userUUID) {
        throw new BadRequestException('User UUID is required');
      }

      const titleLowerCase = createMovieDto.title.toLowerCase();

      const existingMovie = await this.moviesRepository.findOne({
        where: {
          originalTitle: ILike(titleLowerCase),
          userUUID,
        },
      });

      if (existingMovie) {
        throw new BadRequestException('Una pelicula con este titulo ya existe para este usuario');
      }

      const posterUrl = await this.uploadService.uploadImage(file);

      const movie = this.moviesRepository.create({
        originalTitle: titleLowerCase,
        posterUrl,
        releaseDate: new Date().toISOString().split('T')[0],
        voteAverage: 0,
        userUUID,
      });

      return this.moviesRepository.save(movie);
    } catch (e: unknown) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      console.error(e);
      throw new BadRequestException(e instanceof Error ? e.message : 'Error creating movie');
    }
  }

  async getMyMovies(): Promise<MovieDto[]> {
    try {
      const userUUID = this.request.headers['user-uuid'] as string;
      if (!userUUID) {
        throw new BadRequestException('User UUID is required');
      }

      const movies = await this.moviesRepository.find({
        where: { userUUID },
        order: {
          releaseDate: 'DESC',
        },
      });

      return movies.map(movie => ({
        id: movie.id,
        originalTitle: movie.originalTitle,
        posterUrl: movie.posterUrl,
        voteAverage: movie.voteAverage || 0,
        releaseDate: movie.releaseDate || '',
      }));
    } catch (e: unknown) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      console.error(e);
      throw new BadRequestException(e instanceof Error ? e.message : 'Error getting my movies');
    }
  }
}
