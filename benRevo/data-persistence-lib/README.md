# data-persistence-lib
BenRevo Data Persistence Library
 		 
Branch | Status | Coverage
------ | ------ | --------
develop | [![Build Status](https://travis-ci.com/BenRevo/data-persistence-lib.svg?token=24X7QL88xgAPME3tV8MH&branch=develop)](https://travis-ci.com/BenRevo/data-persistence-lib) | [![Coverage Status](https://coveralls.io/repos/github/BenRevo/data-persistence-lib/badge.svg?t=YewzwF)](https://coveralls.io/github/BenRevo/data-persistence-lib)

## Requirements

* Java 1.8
* Apache Maven

## Dependencies

* common-data-lib - https://github.com/BenRevo/common-data-lib

## Setup

1. Clone the repo into your environment

   `git clone https://github.com/BenRevo/data-persistence-lib.git`

2. Change the hibernate.cfg.xml file in the **_META-INF_** folder of the project

   * hibernate.connection.url = [url to server]
   * hibernate.connection.username - [username]
   * hibernate.connection.password - [password]
 
3. Generate library from projects folder: `mvn clean install`


## Dev environment DB access

1. Send your public SSH key to Ryan.  It needs to be added to the AWS bastion host.

2. Tunnel through the bastion to the DB instance:
   `ssh -L 3310:aa1o1nj5j1gdmvx.cbogremexott.us-east-1.rds.amazonaws.com:3306 username@bastion.ops.benrevo.com`
   This sets up port 3310 on your localhost to tunnel through bastion.ops.benrevo.com to the DB instance on port 3306.
   
3. Connect to the Dev DB instance by using 127.0.0.1:3310
