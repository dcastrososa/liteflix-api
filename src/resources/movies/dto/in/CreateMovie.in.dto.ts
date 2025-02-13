import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, IsNotEmpty } from 'class-validator';

export class CreateMovieInDto {
    @ApiProperty({ description: 'The title of the movie', example: 'The Dark Knight', minLength: 3, maxLength: 250 })
    @IsString()
    @IsNotEmpty()
    @Length(3, 250, { message: 'Title must be between 3 and 250 characters' })
    title: string;

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    poster: Express.Multer.File;
} 