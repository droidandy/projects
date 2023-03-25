FROM node:6-slim

ADD ascweb.tar.gz /usr/src

# Create app directory
WORKDIR /usr/src/

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]