# broker-application-service
BenRevo Broker Application Service(s)

Branch | Status | Coverage
------ | ------ | --------
develop | [![Build Status](https://travis-ci.com/BenRevo/broker-application-service.svg?token=24X7QL88xgAPME3tV8MH&branch=develop)](https://travis-ci.com/BenRevo/broker-application-service) | [![Coverage Status](https://coveralls.io/repos/github/BenRevo/broker-application-service/badge.svg?branch=develop&t=inAlix)](https://coveralls.io/github/BenRevo/broker-application-service?branch=develop)
master | [![Build Status](https://travis-ci.com/BenRevo/broker-application-service.svg?token=24X7QL88xgAPME3tV8MH&branch=master)](https://travis-ci.com/BenRevo/broker-application-service) | [![Coverage Status](https://coveralls.io/repos/github/BenRevo/broker-application-service/badge.svg?branch=master&t=inAlix)](https://coveralls.io/github/BenRevo/broker-application-service?branch=master)

## Requirements

* Apache Tomcat 7+
* Java 1.8
* MySQL Server
* Apache Maven

## Dependencies

* common-data-lib - https://github.com/BenRevo/common-data-lib
* data-persistence-lib - https://github.com/BenRevo/data-persistence-lib

## Setup

1. Clone the repo into your environment:

   `git clone https://github.com/BenRevo/broker-application-service.git`

   Using SSH (preferred):

   `git clone git@github.com:BenRevo/broker-application-service.git`

2. Install MySQL and MySQL Workbench locally.

    - Easiest method is via [Homebrew](https://brew.sh/).
      - First install `brew`:

        `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

      - Once done, install `mysql`:

        `brew install mysql`

    - Workbench: [https://www.mysql.com/products/workbench/](https://www.mysql.com/products/workbench/).

3. For multi-carrier preparation and environment separation, the following environment variable should be set accordingly:

    | Name | Value | Required | Notes |
    | ---- | ----- | -------- | ----- |
    | _APP_CARRIER_ | ONE of `{ UHC, ANTHEM_BLUE_CROSS, ... }` | **YES** (more values [here](https://github.com/BenRevo/common-data-lib/blob/develop/src/main/java/com/benrevo/common/enums/CarrierType.java#L16)) | |
    | _TRACE_LOGGING_ | `true/false` | **NO** (default `false`) | Enable for HTTP request logging |
    | _ANALYTICS_ENABLED_ | `true/false` | **NO** (default `false`) | Shouldn't be enabled locally |

    **Note:** The default value for this environment variable is `ALL` which allows the app to work as it did before this change was incorporated.

4. :warning: For [Auth0](https://auth0.com/docs) authentication, you'll need to do one of the following:

    1. Setup an account on AWS with access to the KMS key for Auth0 secrets:

        1. Reach out to an administrator for AWS (Ojas, Ryan, Elliott, Lemdy) to create an account (if you don't already have one)
        2. Once your account is created (ideally with multi-factor auth enabled!), have the administrator add you to the `PropertiesEncryptionKeyUsers` group.
        3. If you can, navigate to IAM in AWS, select your username from `Users` and generate your own `access_key` and `secret_key` and copy them down (for step 5)
        4. Once added, install [awscli](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) (easiest way is with `brew install awscli`)
        5. Once installed correctly, in a new terminal window/tab, type `aws configure` and enter your `access_key` , `secret_key` and `region` [`us-west-2`] -- _do not enter anything when it prompts you for **Output Format**_

           It should look like this when you're done:

           ```bash
           $ aws configure list
                 Name                    Value             Type    Location
                 ----                    -----             ----    --------
              profile                <not set>             None    None
           access_key     ****************XXXX shared-credentials-file
           secret_key     ****************XXXX shared-credentials-file
               region                us-west-2      config-file    ~/.aws/config
           ```

        6. Confirm you can decrypt the auth0 secrets file by starting the application locally (there should be no errors upon startup)

    2. Alternatively, if you still have the old `auth0.properties` or `aws.properties` file, you can place that file in `/src/main/resources/sensitive/preprod` and the `PropertiesDecryptor` will use that over the encrypted file

5. For database connection, you need to add **FIVE** environment variables. In IntelliJ, you can add this by going to Run &#x2192; Edit Configurations and then modifying the  Environment Variables section.    

    | Name | Value | Required |
    | ---- | ----- | -------- |
    | _DB_URL_ | `jdbc:mysql://localhost:3306/br_dev\?useSSL=false` | **YES** |
    | _DB_USERNAME_ | `root` | **YES** |
    | _DB_PASSWORD_ | `root` | **YES** |
    | _DB_DATA_ENCRYPTION_PASSWORD_ | `test` | **YES** |
    | _DB_DATA_ENCRYPTION_ENABLED_ | `false` | **YES** |

    **Note:** To connect to Dev, QA, or Prod environments on your local, change the environment variables above.

6. Create your Database schema and load static data. Scripts can be found under data-persistence-lib:db/...
    - _[schema_v2.sql](https://github.com/BenRevo/data-persistence-lib/blob/develop/db/schema_v2.sql): creates benrevo `br_dev` schema_
    - _[schema_v2_static_data.sql](https://github.com/BenRevo/data-persistence-lib/blob/develop/db/schema_v2_static_data.sql): static data that is used by the system_
    - _[schema_v2_test_seed.sql](https://github.com/BenRevo/data-persistence-lib/blob/develop/db/schema_v2_test_seed.sql): some data required to run tests_

7. Normally you would run mvn clean install -U` but since Spring Boot initializes the app and then runs the test, we need to pass the environment variables to ensure tests don't fail.

    Run the following command in your terminal within the project working directory:

    `mvn clean install -U -DDB_URL=jdbc:mysql://localhost:3306/br_dev\?useSSL=false -DDB_USERNAME=root -DDB_PASSWORD=root -DDB_DATA_ENCRYPTION_PASSWORD=test -DDB_DATA_ENCRYPTION_ENABLED=false -DAPP_CARRIER=UHC` (or `ANTHEM_BLUE_CROSS`)

    * **Note:** All tests should pass and you are ready to launch the server.
    * **Note:** If you would like to see code coerage locally, you can use Jacoco. Change the `mvn clean install -U ...` section to `mvn clean install jacoco:report -U ...`. You can view coverage reports by browsing to `target/site/jacoco/index.html` in your default browser.

        Example output:

        <img src="https://user-images.githubusercontent.com/29079482/29940010-aa94e15c-8e42-11e7-975b-8868cec06d56.png" width="400"/>

8. Run the following, which will launch the service on port 5000:

    `mvn spring-boot:run`

9. Navigate to [http://localhost:5000/swagger-ui.html](http://localhost:5000/swagger-ui.html) to
watch documentation for API endpoints that already exist.

10. For API requests you will need to add a request header:

    `'Authorization' 'Bearer [your_JWT]'`

    - Not required for `/swagger-ui.html` and `OPTIONS` requests
    - JWT Token can be generated by [TokenGenerator.java](https://github.com/BenRevo/broker-application-service/blob/develop/src/main/java/com/benrevo/ws/coreapplication/security/TokenGenerator.java)

11. Further documentation can be found [in our document repo wiki](https://github.com/BenRevo/benrevo-document-repo/wiki)
