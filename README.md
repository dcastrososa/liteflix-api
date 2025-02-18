# Liteflix API

This is a demonstration project that serves as the backend for Liteflix, a movie platform inspired by Netflix.

## Database Configuration

The project uses different database configurations depending on the environment:
- **Development (localhost)**: SQLite for simplicity and ease of setup
- **Production (Heroku)**: PostgreSQL for better performance and scalability

## Environment Variables

A `.env.example` file is included with the necessary environment variables to run the project. For demonstration purposes, the actual values are provided to facilitate project initialization. In a real production environment, these values should be kept secret.

To get started:
1. Copy `.env.example` to `.env`
2. Use the provided values or replace them with your own

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test