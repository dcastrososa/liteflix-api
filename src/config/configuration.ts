import * as process from 'process';

export default () => ({
  themeMovieApi: {
    url: process.env.THEME_MOVIE_API_URL,
    apiKey: process.env.THEME_MOVIE_API_KEY,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
});
