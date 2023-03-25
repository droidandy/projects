FROM registry.rgsbank.ru/cde106/devcloud/docker/base/nginx/raw:1.18

ARG K8S_ENVIRONMENT

COPY ${K8S_ENVIRONMENT}.conf /etc/nginx/conf.d/default.conf

WORKDIR /var/www
