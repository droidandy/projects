FROM registry.rgsbank.ru/cde106/devcloud/docker/base/nodejs/base:16
WORKDIR /opt/ui/

ARG K8S_ENVIRONMENT

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN mv .env_${K8S_ENVIRONMENT} .env && npm run build

CMD ["npm", "run", "start"]
