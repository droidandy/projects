master: [![CircleCI](https://circleci.com/gh/GettUK/gett_ui.svg?style=svg&circle-token=8eb8bc8b9194461aa307d861c888ed53e5bb641c)](https://circleci.com/gh/GettUK/gett_ui)

# Gett Enterprise

## Initial back-end app setup:

- install ruby 2.4.0
- install and run postgresql
- install and run redis
- [install geos (Geometry Engine Open Source)](https://trac.osgeo.org/geos/)
  - `sudo apt-get install libgeos-dev libproj-dev`
  - or for OSX: `brew install geos`
- [install FreeTDS](http://www.freetds.org/)
  - instructions on how to install [here](https://github.com/rails-sqlserver/tiny_tds#install)
  - or for OSX: `brew install freetds`
- install gems and run rails

```sh
$ cp .env.example .env
$ gem install bundler
$ bundle install
$ bin/rails db:create
$ bin/rails db:migrate
$ bin/rails db:seed
$ foreman start
```

Last command starts 3 servers:
- Rails with Puma
- Sidekiq for background tasks execution
- Faye for channeling data from background to web clients

This means that most likely you will have to use `binding.remote_pry` for debugging
purposes.

## Initial front-end app and run dev server:

```
$ cd ui
$ yarn install
$ yarn start
```

## Dev services:

- UI is available at [http://localhost:3030](http://localhost:3030)
- API is available at [http://localhost:3000](http://localhost:3000)
- Sidekiq Web is available at [http://localhost:3000/sidekiq](http://localhost:3000/sidekiq)
- Faye (in case you want to do some manual pushes) is available at [http://localhost:8000](http://localhost:8000)

## API (OT/GETT) details
- https://gett-uk.atlassian.net/wiki/spaces/OTUI/pages/569769/API+Details

## Generating invoices
Easiest way to generate invoices locally is to:
- Create qualifying bookings on today's date.
- Run `bundle exec rails invoices:generate[1,2018-01-20,2018-01-20]` where the
  first parameter is the id of an existing company and the last two parameters
  can be set as today's date.

## Trouble-shooting:

- If you have issues with accessing the app and/or authenticating, try clearing
  your browser history or removing the auth token from local storage
- If you have issues with rspecs (e.g. they suddenly began to fail with the same error) try to stop spring by `bin/spring stop` command.

## Feature specs
- Install Google Chrome
- Install [Chromedriver](https://sites.google.com/a/chromium.org/chromedriver/downloads)
- Prepare DB:
    ```
    RAILS_ENV=test_features rails db:create
    RAILS_ENV=test_features rails db:migrate db:seed
    ```
- Start all servers `foreman start -f features.Procfile`
- Execute specs `rspec spec.features`


## Work with Docker-compose

### Build base image:
```
docker build -t ote-base -f Dockerfile-baseruby .
```
uncomment FROM ote-base and comment other FROM in Dockerfile-backend

### Run compose:
```
docker-compose up
```

### Exec into container:
```
docker-compose exec backend bash
```
if not all envs in container, run inside


## Work with kubernetis

### Connect to k8s-vpn:

- get open vpn config (`k8s.openvpn`) from devops team
- install openvpn:
  - for OSX: install [tunnelblick](https://tunnelblick.net)
  - for ubuntu:
- setup openvpn:
  - for OSX: drag `k8s.openvpn` to tunnelblick
  - for ubuntu: `sudo openvpn --config /opt/openvpn/k8s.ovpn`

- check connection:
  - `curl -k https://api.k8s-dev.gett.systems` should return any result

### Setup aws credentials:
- go to https://console.aws.amazon.com/iam/ and build keys
- install `awscli`:
  - for OSX: `brew install awscli`
- configure `aws`:
  - `aws configure`
  - run result of previous command

### Setup kubectl:

- get config (`k8s-dev.gett.systems-kubeconfig`) from devops team
- save config content to ```~/.kube/config```
- [install kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl)
  - for OSx: `brew install kubectl`

### Helpful kubectl commands:
```
$ kubectl get pods
$ kubectl logs <NAME_OF_POD>
$ kubectl exec -it <NAME_OF_POD> /bin/bash
$ kubectl --help
```

### Tips and tricks:

TODO: write about hotfixes, puma reload, etc

https://confluence.gtforge.com/pages/viewpage.action?spaceKey=DEVOPS&title=Manual+for+Kubernetes+dev+cluster

### Favicon generation:

- install cli-real-favicon:
   - `npm install -g cli-real-favicon`
- go to `ui/config/`
- modify `masterPicture` at line 2 of `faviconDescription.json`
- modify `paramValue` at line 56 of `faviconDescription.json` to update hash of favicons
- run from `ui`: `real-favicon generate config/faviconDescription.json config/faviconData.json assets`
- move all generated file to `public` at the root with replacing the old one
- replace `src/favicon.ico` with new generated file (have the same name)

See more at https://github.com/RealFaviconGenerator/cli-real-favicon
