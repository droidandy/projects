/**
 * Container Generator
 */

const componentExists = require('../utils/componentExists');
const basePath = '../../app/pages/';

module.exports = {
  description: 'Add a Page',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: 'HelloWorld',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return componentExists(value) ? 'A component, container or page with this name already exists' : true;
      }

      return 'The name is required';
    },
  }, {
    type: 'list',
    name: 'component',
    message: 'Select a base component:',
    default: 'PureComponent',
    choices: () => ['PureComponent', 'Component'],
  }, {
    type: 'confirm',
    name: 'wantHeaders',
    default: false,
    message: 'Do you want headers?',
  }, {
    type: 'confirm',
    name: 'wantActionsAndReducer',
    default: true,
    message: 'Do you want an actions/constants/reducer tuple for this container?',
  }, {
    type: 'confirm',
    name: 'wantSagas',
    default: true,
    message: 'Do you want sagas for asynchronous flows? (e.g. fetching data)',
  }, {
    type: 'confirm',
    name: 'wantMessages',
    default: true,
    message: 'Do you want i18n messages (i.e. will this component use text)?',
  }],
  actions: (data) => {
    // Generate index.js and UserProfileMenu.index.test.js
    const actions = [
      {
        type: 'add',
        path: `${basePath}{{properCase name}}/index.js`,
        templateFile: './page/index.js.hbs',
        abortOnFail: true,
      }, {
        type: 'add',
        path: `${basePath}{{properCase name}}/{{properCase name}}.jsx`,
        templateFile: './page/component.js.hbs',
        abortOnFail: true,
      }, {
        type: 'add',
        path: `${basePath}{{properCase name}}/tests/index.test.js`,
        templateFile: './page/test.js.hbs',
        abortOnFail: true,
      },
    ];

    // If component wants messages
    if (data.wantMessages) {
      actions.push({
        type: 'add',
        path: `${basePath}{{properCase name}}/messages.js`,
        templateFile: './page/messages.js.hbs',
        abortOnFail: true,
      });
    }

    // If they want actions and a reducer, generate actions.js, constants.js,
    // reducer.js and the corresponding tests for actions and the reducer
    if (data.wantActionsAndReducer) {
      // Actions
      actions.push({
        type: 'add',
        path: `${basePath}{{properCase name}}/actions.js`,
        templateFile: './page/actions.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: `${basePath}{{properCase name}}/tests/actions.test.js`,
        templateFile: './page/actions.test.js.hbs',
        abortOnFail: true,
      });

      // Constants
      actions.push({
        type: 'add',
        path: `${basePath}{{properCase name}}/constants.js`,
        templateFile: './page/constants.js.hbs',
        abortOnFail: true,
      });

      // Selectors
      // actions.push({
      //   type: 'add',
      //   path: '../../app/containers/{{properCase name}}/selectors.js',
      //   templateFile: './container/selectors.js.hbs',
      //   abortOnFail: true,
      // });
      // actions.push({
      //   type: 'add',
      //   path: '../../app/containers/{{properCase name}}/tests/selectors.test.js',
      //   templateFile: './container/selectors.test.js.hbs',
      //   abortOnFail: true,
      // });

      // Reducer
      actions.push({
        type: 'add',
        path: `${basePath}{{properCase name}}/reducer.js`,
        templateFile: './page/reducer.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: `${basePath}{{properCase name}}/tests/reducer.test.js`,
        templateFile: './page/reducer.test.js.hbs',
        abortOnFail: true,
      });
    }

    // Sagas
    if (data.wantSagas) {
      actions.push({
        type: 'add',
        path: `${basePath}{{properCase name}}/sagas.js`,
        templateFile: './page/sagas.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: `${basePath}{{properCase name}}/tests/sagas.test.jss`,
        templateFile: './page/sagas.test.js.hbs',
        abortOnFail: true,
      });
    }

    return actions;
  },
};
