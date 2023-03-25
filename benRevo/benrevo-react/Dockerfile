FROM node:latest

EXPOSE 3000

ARG PACKAGE
ENV PORT=3000

WORKDIR /src

RUN mkdir -p /src/build
RUN mkdir -p /src/server
RUN mkdir -p /src/assets-external

COPY ./packages/$PACKAGE/package.json /src/
COPY ./packages/$PACKAGE/setenv.js /src/
COPY ./packages/$PACKAGE/build /src/build
COPY ./packages/$PACKAGE/server /src/server
COPY ./packages/$PACKAGE/app/assets-external /src/assets-external

RUN npm install cross-env@3.1.3
RUN npm install env-cmd@5.0.0
RUN npm install chalk@1.1.3
RUN npm install ip@1.1.4
RUN npm install splunk-logging@0.9.3
RUN npm install express@4.14.0
RUN npm install minimist@1.2.0
RUN npm install ngrok@2.2.4
RUN npm install compression@1.6.2
RUN npm install webpack@2.2.0-rc.3
RUN npm install webpack-dev-middleware@1.9.0
RUN npm install webpack-hot-middleware@2.15.0
RUN npm install body-parser@1.17.2

ENTRYPOINT ["npm", "run", "start:prod"]
