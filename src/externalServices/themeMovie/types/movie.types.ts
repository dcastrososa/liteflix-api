export interface MovieResponse {
  results: Movie[];
}

export interface Movie {
  id: number;
  original_title: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
}
