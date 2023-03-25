FROM ruby:2.5.3

ENV APP_DIR /app
WORKDIR $APP_DIR

COPY Gemfile Gemfile.lock $APP_DIR/

# access to private github repository via github token
ARG GH_TOKEN
RUN bundle config GITHUB__COM $GH_TOKEN:x-oauth-basic && bundle install
#RUN bundle install

# copy project
COPY . $APP_DIR/

# run app on 3000 port
EXPOSE 3000
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
