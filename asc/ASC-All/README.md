# Introduction

This repo is to create a local development environment which pulls together all APIs and the front-end code in a production-like environment utilizing Docker.
To start, it will only include Docker images pulled together by Docker compose but in the future it will likely also include automatically setting up Kubernetes and surrounding technologies.

## Getting Started

This will enable you to run all services locally using Docker compose / Swarm.

1. From the root of this directory, type `Swarm init` (only need to do this first time)
1. Create the local docker network via `docker network create -d overlay docker_ascnet --attachable`

Either run all services from existing LOCAL images built or pull from Azure Container Registry (ACR).  
LOCAL

1. Remove the ".local" from the /docker/docker-compose.local.yml file
1. Ensure that all images are built on your local docker host using default names
1. In the docker directory, run `docker-compose up -d`

ACR

1. Remove the ".acr" from the /docker/docker-compose.acr.yml file
1. Set docker credentials to pull images from ACR.  
`docker login ascregistry-on.azurecr.io -u 'af6ba355-1b1c-4dff-841c-b1ff222e0e91' -p '1dd748d4-7706-4cf1-85e0-fbceb9ad84ca'`
1. In the docker directory, run `docker-compose up -d`

## Viewing running configuration

You should now be able to see all images running via `docker ps` and can see they are all attached to the ascnet overlay network via `docker network inspect docker_ascnet`.  Because these are swarm services, they have local name discovery between each other automatically.

## Cleanup Resources

You can stop and remove all of the running services by running the following from the /docker path:  
`docker-compose stop`  
`docker-compose rm`

## Refreshing Docker images

To get the latest images for all of the services running in production from ACR or local, execute:

`docker-compose pull`

The new images are visible via `docker images`.  Then assuming you've stopped and removed the containers, the next time you run the `docker-compose up -d` all the latest images will be running locally.

## Resources

https://docs.docker.com/compose/