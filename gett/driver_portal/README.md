# Driver Portal

## How can I start development?

It's supposed that you already have installed standard tool chain like [Git](https://git-scm.com/), [Ruby 2.4](https://github.com/rbenv/rbenv), [Bundler](http://bundler.io/), [Node 8.0.x](https://github.com/riywo/ndenv) and [Yarn](https://yarnpkg.com/lang/en/docs/install/). Also you need to install [PostgreSQL](https://www.postgresql.org) and [Redis](https://redis.io/).

### Server: Local

Download and prepare our application to run:

```
$ git clone git@github.com:GettUK/driver_portal.git
$ cd driver_portal
$ bundle install
$ bin/setup
```

And run it:

```
$ bin/rails s
```

You can also generate simple set of data using seed:

```
$ bin/rails db:seed
```

Check that sever is up and running:

```
$ open http://localhost:3000
```

### Emails

If you want to send and receive emails in development you need to run local SMTP server.

```
$ bin/mailcatcher
$ open http://127.0.0.1:1080
```

### Server: Docker

Another way to run app in dev is to build docker image:

```
PORT=3000 \
DB_HOST=127.0.0.1 \
DB_NAME=driver_portal_development \
SECRET_KEY_BASE=26b6e0a4da14dad43f3b86cdcb0d519349b0be2439dd6e8505725546c09f5f7d5ac8728ac7201d68f5fee9241a52e537a262cfea7492d8c8ca4a89e6c8af4786 \
JWT_SECRET=f41bdc7c70f5d80c47aeebe80b0337a5230709d08234790c5afec8a5ff66bf193a7ccaa1d22fbba94ef4bd48a6748f6141e3695b7272f2c0d57796efdd7d7517 \
RAILS_LOG_TO_STDOUT=true \
bin/build
```

This image can be used to create container:

```
$ docker run -d --rm --publish 3000:3000 --name driver_portal gett_uk/driver_portal
```

Check that it is active:

```
$ docker ps # check CONTAINER ID
```

And available:

```
$ open http://locahost:3000
```

And stop it:

```
docker stop <CONTAINER ID>
```

### UI

```
cd ui
yarn install
yarn start
```

### Tests

Run migrations in test environment to be sure that you are up to date:


```
RAILS_ENV=test bin/rails db:migrate
```

Now you can run specs and style checks:

```
bin/rspec
bin/rubocop
```

### API Docs

#### Generate

To generate up to date API documentation based on existing specs run:

```
$ bin/swaggerize
```

Now you can commit your changes and push them to repository.

#### View locally

Launch swagger-ui with current API docs locally, using:

```
$ bin/api_docs
```

Now you can visit `localhost` in your browser to view the docs.
