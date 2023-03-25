# XthriftAPI

XthriftAPI is a RESTful api service for awesome application made for thrift stores.

## Prerequisites
Make all of the following prerequisites are installed on the development machine:
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* Postgresql - [Download & Install Postgresql](http://www.postgresql.org/download/).
* Gulp - You're going to use the [Gulp Task Runner](http://gulpjs.com/) to automate the development process. Make Node.js and npm is installed first, then install gulp globally using npm:

```bash
$ npm install -g gulp gulp-cli
```

### Cloning The GitHub Repository

```bash
$ git clone https://github.com/hdfelix/XthriftAPI.git
```

## Quick Install

Install the Node.js dependencies:

```bash
$ npm install
```

## Running Your Application
After the install process is over:

```
$ gulp
```

The application should run on port 3000 with the *development* environment configuration.

* explore `config/env/development.js` for development environment configuration options

### Running in Production mode

```bash
$ gulp prod
```

* explore `config/env/production.js` for production environment configuration options

## Testing Your Application
Minimal testing

```bash
$ gulp test
```

### Generating Document

```bash
$ gulp doc
```

The document will be hosted on port 8080 in localhost.
