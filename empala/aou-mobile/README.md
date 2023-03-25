### Running the application

1. checkout the code (use `dev` or `feature` branch)
1. `yarn install`
1. `npx pod-install`
1. running on iOS simulator: `npx react-native run-ios`
 


### Branches

- production: master
- development: feature


### GraphQL Scheme Generation

To update scheme run command:

```
API_TOKEN="TOKEN" npm run generate-core
HASURA_ADMIN_SECRET="SECRET"  npm run generate-hasura
```
or
```
API_TOKEN="TOKEN" yarn generate-core
HASURA_ADMIN_SECRET="SECRET" yarn generate-hasura
```

For getting jwt_token, login under any user in application and copy it from log
