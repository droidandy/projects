FROM node:6.10.0

EXPOSE 3000

RUN mkdir -p /src/build
RUN mkdir -p /src/server
WORKDIR /src
COPY ./build /src/build
COPY ./server /src/server
COPY ./package.json /src/
COPY ./Dockerrun.aws.json /src/
COPY ./.elasticbeanstalk/config.yml /src/.elasticbeanstalk
RUN npm install --quiet

ENTRYPOINT ["npm", "run", "start:prod"]
