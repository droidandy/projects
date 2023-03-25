[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# aou-backend
This is a [Moleculer](https://moleculer.services/) -based microservices project. Generated with the [Moleculer CLI](https://moleculer.services/docs/0.14/moleculer-cli.html).

## Usage
Start the project with `npm run dev` command. 
After starting, open the http://localhost:3000/ URL in your browser. 
On the welcome page you can test the generated services via API Gateway and check the nodes & services.

In the terminal when the service is running, try the following commands:
- `nodes` - List all connected nodes.
- `actions` - List all registered service actions.

## Useful links

* Moleculer website: https://moleculer.services/
* Moleculer Documentation: https://moleculer.services/docs/0.14/
* TypeORM
   * Home Page: https://typeorm.io/
   * Migrations: https://typeorm.io/#/migrations

## Git hooks
* Pre-commit: First builds current-schema.graphql and stages it for commit if it changes.  Then it runs test:unit and test:withdb.

## Data migrations implementations guidelines
* We use OVERRIDING SYSTEM VALUE when inserting dummy data in migration scripts so we are in control of the ID of each record. (https://wiki.postgresql.org/wiki/Fixing_Sequences)
* Due to this, we need to make sure that we reset the sequence values for those ids so that values for "id" column auto-assigned in mutations start with max+1, thus not leading to any conflicts with pre-inserted dummy data
* At the end of a migration file where dummy data is inserted, run something like this:
  * SELECT SETVAL('launchpad.achievement_id_seq', COALESCE(MAX(id), 1) ) FROM launchpad.achievement;

## NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run lint`: Run ESLint
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose


## How to use run Apollo-GraphQL server locally with authentication
https://gitlab.com/empala/aou-backend/-/wikis/How-to-launch-Apollo-GraphQL-server-locally-and-to-use-authentication

## Hasura configuration

After successful container launch, you must have all migrations applied on your db and you will need to run the following commands:

```bash
npm i -g hasura-cli
hasura metadata apply --endpoint http://localhost:8080 --admin-secret myadminsecretkey --project hasura
```

If you have issues with hasura-cli, you might need to install glibc and libstdc++ for hasura-cli to your OS:
https://github.com/hasura/graphql-engine/issues/4105#issuecomment-609639030
