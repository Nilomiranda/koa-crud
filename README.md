# Basic Typescript Boilerplate

This a simple boilerplate to help you get started with typescript node development.

## Batteries included

### Code quality
- Prettier
- Eslint
- Lint staged

## Overall structure

`index.ts` is the entry point for the project.

## Deployment on Heroku

There's a procfile configure to help with Heroku hosting, to make the bot properly work.
If you plan on using it, make sure the value associated to `service` matches your server start command
or any other command you need in order to get everything running.

If you plan on hosting somewhere else, just get rid of this file.
