import { Controller, Get, Post, UseInterceptors, UploadedFile, Body, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { MoviesService } from "./movies.service";
import { ApiOperation, ApiOkResponse, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { UploadService } from '../../common/services/upload.service';
import { CreateMovieInDto } from './dto/in/CreateMovie.in.dto';
import { MovieDto } from "./dto/out/Movie.out.dto";

@Controller('movies')
export class MoviesController {
    constructor(
        private readonly moviesService: MoviesService,
        private readonly uploadService: UploadService,
    ) { }

    @Get('now-playing')
    @ApiOperation({ summary: 'Get now playing movie' })
    @ApiOkResponse({ description: 'Now playing movie', type: MovieDto })
    async getNowPlaying() {
        return this.moviesService.getNowPlaying();
    }

    @Get('popular')
    @ApiOperation({ summary: 'Get popular movies' })
    @ApiOkResponse({ description: 'Popular movies', type: MovieDto, isArray: true })
    async getPopular() {
        return this.moviesService.getPopular();
    }

    @Post()
    @UseInterceptors(FileInterceptor('poster', {
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
                return callback(new BadRequestException('Only image files (jpg, jpeg, png, gif) are allowed'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB
        }
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        type: CreateMovieInDto
    })
    async createMovie(
        @UploadedFile() poster: Express.Multer.File,
        @Body() createMovieDto: CreateMovieInDto
    ) {
        if (!poster) {
            throw new BadRequestException('Poster file is required');
        }
        return this.moviesService.createMovie(createMovieDto, poster);
    }

    @Get('my-movies')
    @ApiOperation({ summary: 'Get all my uploaded movies' })
    @ApiOkResponse({ description: 'List of my movies', type: MovieDto, isArray: true })
    async getMyMovies() {
        return this.moviesService.getMyMovies();
    }
}
