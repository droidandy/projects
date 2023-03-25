FROM node:14.15.1-stretch
ENV NODE_ENV production
ENV PORT 3000
WORKDIR /app
RUN apt-get update -qq && apt-get install -y git-core curl build-essential nodejs zlib1g-dev libpq-dev sudo imagemagick procps
COPY package*.json /app/
RUN yarn install
COPY ./ /app
RUN yarn build
ENV PATH $PATH:/app/node_modules/.bin
EXPOSE 3000
USER root
RUN apt-get update && apt-get -y install nginx && \
    rm -rf /var/lib/apt/lists/* /etc/nginx/nginx.conf && \
    sudo mkdir -p /var/log/nginx /var/lib/nginx && \
    sudo touch /var/run/nginx.pid && \
    sudo chmod 777 /var/run/nginx.pid

# Include only the release build and production packages.
# COPY --from=build-target /app/node_modules node_modules
# COPY --from=build-target /app/.next .next

CMD ["yarn", "start"]
