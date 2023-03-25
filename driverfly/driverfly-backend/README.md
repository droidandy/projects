> ### Due Pet NestJS backend codebase


----------

# Getting started

## Installation

Ensure you have node 8.16.0+ and npm 6.12.0+
    
Install dependencies
    
    npm install

Copy config file and set JsonWebToken secret key

    cp src/config.ts.example src/config.ts
    
----------

## Database

The example codebase uses [Typeorm](http://typeorm.io/) with a mySQL database.

Create a new mysql database with the name `duepet` (or the name you specified in the ormconfig.json)

Copy Typeorm config example file for database settings

    cp ormconfig.js.example ormconfig.js
    
Set mysql database settings in ormconfig.json

    {
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "username": "your-mysql-username",
      "password": "your-mysql-password",
      "database": "duepet",
      "entities": ["src/**/**.entity{.ts,.js}"],
      "synchronize": true
    }
    
Start local mysql server and create new database 'duepet'

On application start, tables for all entities will be created.

----------

## NPM scripts

- `npm start` - Start application
- `npm run start:watch` - Start application in watch mode
- `npm run test` - run Jest test runner 
- `npm run prestart:prod` - Build application
- `npm run start:prod` - Start the built js application

----------

## API Specification

WIP

----------

## Start application

- `npm start`
- Test api with `http://localhost:3000/api/` in your favourite browser

----------

# Authentication
 
This applications uses JSON Web Token (JWT) to handle authentication. The token is passed with each request using the `Authorization` header with `Token` scheme. The JWT authentication middleware handles the validation and authentication of the token. Please check the following sources to learn more about JWT.

----------
 
# Swagger API docs

This example repo uses the NestJS swagger module for API documentation. [NestJS Swagger](https://github.com/nestjs/swagger) - [www.swagger.io](https://swagger.io/)        