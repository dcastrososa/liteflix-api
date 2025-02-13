import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

@Injectable()
export class ThemeMovieService {
  private readonly apiKey: string;
  private readonly url: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('themeMovieApi.apiKey') || 
      (() => { throw new Error('Missing themeMovieApi.apiKey configuration') })();
    this.url = this.configService.get<string>('themeMovieApi.url') || 
      (() => { throw new Error('Missing themeMovieApi.url configuration') })();
  }

  async getNowPlaying() {
    const response = await axios.get(`${this.url}/movie/now_playing`, {
      params: {
        api_key: this.apiKey,
      },
    });
    return response;
  }

  async getPopular() {
    const response = await axios.get(`${this.url}/movie/popular`, {
      params: {
        api_key: this.apiKey,
      },
    });
    return response;
  }
}
