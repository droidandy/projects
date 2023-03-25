FROM node:6.10.0

EXPOSE 3000

RUN printenv

RUN mkdir -p /src/build
RUN mkdir -p /src/server
RUN mkdir -p /src/.elasticbeanstalk
WORKDIR /src
COPY ./build /src/build
COPY ./server /src/server
COPY ./package.json /src/
ARG NPM_TOKEN
COPY ./.npmrc /src/
COPY ./setenv.js /src/
COPY ./Dockerrun.aws.json /src/
COPY ./.elasticbeanstalk/config.yml /src/.elasticbeanstalk
RUN npm install --quiet
RUN rm -f .npmrc

ENTRYPOINT ["npm", "run", "start:prod"]
