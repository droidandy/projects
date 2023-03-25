To run existing builds of this and all surrounding microservices using Docker, please see the [ASC-All repository readme](https://xsc.visualstudio.com/ASC/_git/ASC-All?path=%2FREADME.md&version=GBmaster&_a=contents).

## How to run it

To run it simply do:

```bash
npm install
npm start
```

The app will run at [http://localhost:9000](http://localhost:9000).

## How to test it

```bash
npm run test
```

or you can run watch:

```bash
npm run test -- --watch
```

## How to build it

You need to build the project first before Cordova:

```
npm run build
```

## Build the mobile app with Cordova

- [Install Cordova](https://cordova.apache.org/docs/en/latest/guide/cli/index.html#installing-the-cordova-cli):

```
npm install -g cordova
```

Add a platform and then run it on a local emulator.

For Android:

```
cordova platform add android
cordova run android
```

For iOS:

```
cordova platform add ios
cordova run ios
```

## How to use validation for redux-form

```
import { createValidator, required, email } from '../utils/validation';

const validate = createValidator({
  email: [required, email],
});

@reduxForm({
  form: 'ValidateForm',
  validate
})
```
