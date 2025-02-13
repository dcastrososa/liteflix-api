import { ApiProperty } from "@nestjs/swagger";

export class MovieDto {
    @ApiProperty({ description: 'The id of the movie', example: 1 })
    id: number;

    @ApiProperty({ description: 'The original title of the movie', example: 'The Dark Knight' })
    originalTitle: string;

    @ApiProperty({ description: 'The poster url of the movie', example: 'https://image.tmdb.org/t/p/w1280/poster.jpg' })
    posterUrl: string;

    @ApiProperty({ description: 'The vote average of the movie', example: 8.5 })
    voteAverage: number;

    @ApiProperty({ description: 'The release date of the movie', example: '2008-07-18' })
    releaseDate: string;
}