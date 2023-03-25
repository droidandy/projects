FROM ruby:2.4-alpine

ARG DB_HOST
ARG DB_NAME
ARG DB_USER
ARG DB_PASSWORD
ARG SECRET_KEY_BASE
ARG JWT_SECRET
ARG PORT
ARG ROLLBAR_ACCESS_TOKEN

ENV RAILS_ENV production
ENV RACK_ENV production
ENV PORT $PORT

ENV DB_HOST $DB_HOST
ENV DB_NAME $DB_NAME
ENV DB_USER $DB_USER
ENV DB_PASSWORD $DB_PASSWORD

ENV SECRET_KEY_BASE $SECRET_KEY_BASE
ENV JWT_SECRET $JWT_SECRET
ENV ROLLBAR_ACCESS_TOKEN $ROLLBAR_ACCESS_TOKEN
ENV RAILS_LOG_TO_STDOUT $RAILS_LOG_TO_STDOUT

RUN apk add --update g++ make postgresql-dev

RUN gem install --no-document bundler
RUN mkdir /app

COPY Gemfile Gemfile.lock /app/

WORKDIR /app

RUN bundle install --without development test

COPY . /app/
RUN cp config/database.example.yml config/database.yml
RUN cp config/secrets.example.yml config/secrets.yml

CMD puma --config /app/config/puma.rb
