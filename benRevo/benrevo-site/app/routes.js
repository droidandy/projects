import { getAsyncInjectors } from './utils/asyncInjectors';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  const { injectReducer, injectSagas } = getAsyncInjectors(store);

  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Home'),
        ]);

        const renderRoute = loadModule(cb, 'home');

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/carriers',
      name: 'carriers',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Carriers'),
        ]);

        const renderRoute = loadModule(cb, 'carriers');

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/brokers',
      name: 'brokers',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Brokers'),
        ]);

        const renderRoute = loadModule(cb, 'brokers');

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/about',
      name: 'about',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/About'),
        ]);

        const renderRoute = loadModule(cb, 'about');

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/contact',
      name: 'contact',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Contact/reducer'),
          import('pages/Contact/sagas'),
          import('pages/Contact'),
        ]);

        const renderRoute = loadModule(cb, 'contact.page');

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('contactPage', reducer.default);
          injectSagas(sagas.default, 'contactPage');
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/privacy',
      name: 'privacy',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Terms'),
        ]);

        const renderRoute = loadModule(cb, 'privacy');

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        import('pages/NotFound')
          .then(loadModule(cb, '404'))
          .catch(errorLoading);
      },
    },
  ];
}
