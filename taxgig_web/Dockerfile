FROM alpine:latest

LABEL maintainer="Ilya Svyatko <jlyl@protonmail.ch>"

# Important!  Update this no-op ENV variable when this Dockerfile
# is updated with the current date. It will force refresh of all
# of the base images and things like `apt-get update` won't be using
# old cached versions when the Dockerfile is built.
ENV REFRESHED_AT=2019-04-27 \
    LANG=en_US.UTF-8 \
    HOME=/opt/app/ \ 

RUN \
    apk --no-cache --update upgrade && \
    apk add --no-cache --update \
      bash \
      make \
      git \
      nodejs \
      npm 

WORKDIR ${HOME}

CMD ["/bin/sh"]