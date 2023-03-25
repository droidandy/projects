# Artemis Fleets

## Install
  * ruby - .ruby-version
  * nodejs - latest version

## Run application on local machine:

1. run ssh tunel to have access to datasource:
  * you need ssh key for tunel:
    `id_rsa_gett`
  * set GETT_DB_USER and GETT_DB_PASS env variable with valid password:
    `echo 'export GETT_DB_USER="" >> ~/.bash_profile'`
    `echo 'export GETT_DB_PASS="" >> ~/.bash_profile'`
  * `ssh -Ng -L 3307:uk-replica.gtforge.com:3306 -i ~/.ssh/id_rsa_gett anton.macius@ssh-gw.gtforge.com`

2. start dev servers:
  * `bundle install`
  * `bundle exec rake db:{create,migrate,seed}`
  * `foreman start` - rails + faye
  * `cd ui && yarn install && yarn start`

## Tests
 * run ssh tunel before specs
 * `bundle exec rspec`
