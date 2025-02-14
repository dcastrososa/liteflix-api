import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { UploadService } from '../../common/services/upload.service';
import { BadRequestException } from '@nestjs/common';
import { CreateMovieInDto } from './dto/in/CreateMovie.in.dto';

jest.mock('src/externalServices/themeMovie/themeMovie.service', () => ({
  ThemeMovieService: jest.fn().mockImplementation(() => ({
    getNowPlaying: jest.fn(),
    getPopular: jest.fn(),
  }))
}));

describe('MoviesController', () => {
  let controller: MoviesController;
  let moviesService: MoviesService;

  const mockMovie = {
    id: 1,
    title: 'Test Movie',
    description: 'Test Description',
    posterUrl: 'http://example.com/poster.jpg',
    releaseDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockMoviesService = {
    getNowPlaying: jest.fn(),
    getPopular: jest.fn(),
    createMovie: jest.fn(),
    getMyMovies: jest.fn(),
  };

  const mockUploadService = {
    uploadFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getNowPlaying', () => {
    it('should return now playing movie', async () => {
      mockMoviesService.getNowPlaying.mockResolvedValue(mockMovie);
      
      const result = await controller.getNowPlaying();
      
      expect(result).toEqual(mockMovie);
      expect(moviesService.getNowPlaying).toHaveBeenCalled();
    });
  });

  describe('getPopular', () => {
    it('should return popular movies', async () => {
      const mockMovies = [mockMovie, { ...mockMovie, id: 2 }];
      mockMoviesService.getPopular.mockResolvedValue(mockMovies);
      
      const result = await controller.getPopular();
      
      expect(result).toEqual(mockMovies);
      expect(moviesService.getPopular).toHaveBeenCalled();
    });
  });

  describe('createMovie', () => {
    it('should create a movie with valid data', async () => {
      const mockFile = {
        fieldname: 'poster',
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1024,
      } as Express.Multer.File;

      const createMovieDto: CreateMovieInDto = {
        title: 'New Movie',
        poster: mockFile,
      };

      mockMoviesService.createMovie.mockResolvedValue(mockMovie);

      const result = await controller.createMovie(mockFile, createMovieDto);

      expect(result).toEqual(mockMovie);
      expect(moviesService.createMovie).toHaveBeenCalledWith(createMovieDto, mockFile);
    });

    it('should throw BadRequestException when poster is not provided', async () => {
      const createMovieDto = {
        title: 'New Movie',
        poster: undefined as unknown as Express.Multer.File,
      };

      await expect(controller.createMovie(undefined as unknown as Express.Multer.File, createMovieDto))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('getMyMovies', () => {
    it('should return list of my movies', async () => {
      const mockMovies = [mockMovie, { ...mockMovie, id: 2 }];
      mockMoviesService.getMyMovies.mockResolvedValue(mockMovies);
      
      const result = await controller.getMyMovies();
      
      expect(result).toEqual(mockMovies);
      expect(moviesService.getMyMovies).toHaveBeenCalled();
    });
  });
}); 