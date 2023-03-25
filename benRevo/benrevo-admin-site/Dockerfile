FROM node:6.10.0

# metadata
WORKDIR /src
EXPOSE 3000
ENTRYPOINT ["npm", "run", "start:prod"]

# file copies
COPY ["package.json", "setenv.js", "Dockerrun.aws.json", "./"]
COPY [".elasticbeanstalk/config.yml", ".elasticbeanstalk/"]

# directory copies
COPY ["server", "server"]
COPY ["node_modules", "node_modules"]
COPY ["build", "build"]
