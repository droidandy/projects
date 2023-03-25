FROM registry.rgsbank.ru/cde106/devcloud/docker/base/nodejs/base:14

WORKDIR /opt/bff/

RUN apt-get update && apt-get install -y curl && apt-get install -y ca-certificates
COPY .rgs/docker/rgsbrootca.crt /usr/local/share/ca-certificates/rgsbrootca.crt
RUN update-ca-certificates

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN npm run build

CMD ["npm", "run", "boot"]