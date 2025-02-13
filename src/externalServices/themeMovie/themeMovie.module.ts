import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThemeMovieService } from "./themeMovie.service";

@Module({
    imports: [ConfigModule],
    providers: [ThemeMovieService],
    exports: [ThemeMovieService],
})
export class ThemeMovieModule {}