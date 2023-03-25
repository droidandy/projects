FROM node:6.10.0

EXPOSE 3000

RUN mkdir -p /src
WORKDIR /src
COPY . /src
RUN npm install

ENTRYPOINT ["npm", "run", "start:production"]

