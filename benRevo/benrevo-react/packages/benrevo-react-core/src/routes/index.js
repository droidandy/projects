  // These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import mixpanel from 'mixpanel-browser';
import {
    requireAuth,
} from '../utils/authService/lib';
import { MIXPANEL_KEY } from '../secrets';
import Logger from '../logger';

if (process.env.NODE_ENV !== 'test') mixpanel.init(MIXPANEL_KEY);

export const checkAuth = (nextState, replace) => requireAuth(nextState, replace);

export const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

export const loadModule = (cb, name) => (componentModule) => {
  if (name !== null) {
    mixpanel.track(`Route loaded: ${name}`);
    Logger.info(`Route loaded: ${name}`);
  }
  cb(null, componentModule.default);
};

export const loadModuleClear = (cb, name) => (componentModule) => {
  if (name !== null) {
    mixpanel.track(`Route loaded: ${name}`);
    Logger.info(`Route loaded: ${name}`);
  }
  cb(null, componentModule);
};

export function checkClientRoute(nextState, replace, store, type, setRouteError, selectDirectToPresentation) {
  const client = store.getState().get('clients').get('current');
  const clientState = client.get('clientState');
  const redirect = () => {
    store.dispatch(setRouteError(true, type));
    replace({
      pathname: '/clients',
      state: { nextPathname: nextState.location.pathname },
    });
  };
  if (type === 'rfp') {
    if ((!client.get('id') && !client.get('isNew')) || selectDirectToPresentation(store.getState())) {
      redirect();
      return true;
    }
    const products = store.getState().get('clients').get('current').get('products').toJS();
    const virginCoverage = store.getState().get('clients').get('current').get('virginCoverage').toJS();
    const section = nextState.routes[2].path;
    if (products[section] === false) {
      replace({
        pathname: '/rfp/client/products',
      });
    } else if ((section === 'rates' || section === 'enrollment' || section === 'plans') &&
      (nextState.routes[3] && (products[nextState.routes[3].path] === false || virginCoverage[nextState.routes[3].path]))) {
      let firstPage = '';
      for (let i = 0; i < Object.keys(products).length; i += 1) {
        const item = Object.keys(products)[i];

        if (products[item] && !virginCoverage[item] && ((section !== 'plans' && section !== 'enrollment') || (item === 'medical' || item === 'dental' || item === 'vision'))) {
          firstPage = item;
          break;
        }
      }
      if (firstPage) {
        replace({
          pathname: `/rfp/${nextState.routes[2].path}/${firstPage}`,
        });
      } else {
        replace({
          pathname: '/rfp/client/products',
        });
      }
    }
  } else if (type === 'onboarding' && (clientState === 'undefined' || (clientState !== 'On-Boarding' && clientState !== 'Closed' && clientState !== 'Sold') || !client.get('id'))) redirect();
  return true;
}

/*
 * todo (rford) refactor getComponent out to reusable func to reduce boiler plate;
 * */

export default function createRoutes(store, injectReducer, injectSagas) {
  // create reusable async injectors using getAsyncInjectors factory
  return [
    {
      path: '/ga',
      indexRoute: { onEnter: (nextState, replace) => replace('ga/account') },
      name: 'GAPage',
      onEnter: checkAuth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('../pages/Ga/sagas'),
          System.import('../pages/Ga'),
        ]);

        const renderRoute = loadModule(cb, 'ga');
        importModules.then(([sagas, component]) => {
          injectSagas(sagas.default, 'ga');
          renderRoute(component);
        });
        importModules.catch(errorLoading);
      },
      childRoutes: [
        {
          path: 'account',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              System.import('../pages/Ga/account'),
            ]);

            const renderRoute = loadModule(cb, 'Ga.account');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: 'account/lisi',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              System.import('../pages/Ga/account'),
            ]);

            const renderRoute = loadModule(cb, 'Ga.account');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        }, {
          path: 'account/warner',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              System.import('../pages/Ga/account'),
            ]);

            const renderRoute = loadModule(cb, 'Ga.account');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: 'email-verification',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              System.import('../pages/Ga/EmailVerificationLanding'),
            ]);

            const renderRoute = loadModule(cb, 'Ga.emailVerificationLanding');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
      ],
    },
    {
      path: '/companydetail',
      name: 'companyDetailPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('../pages/CompanyDetail/reducer'),
          System.import('../pages/CompanyDetail/sagas'),
          System.import('../pages/CompanyDetail'),
        ]);

        const renderRoute = loadModule(cb, 'companydetail');

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('companyDetailPage', reducer.default);
          injectSagas(sagas.default, 'companyDetailPage');
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/carrier',
      indexRoute: { onEnter: (nextState, replace) => replace('carrier/home') },
      name: 'carierPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('../pages/Carrier'),
        ]);

        const renderRoute = loadModule(cb, 'carrier');
        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
      childRoutes: [
        {
          path: 'home',
          onEnter: checkAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              System.import('../pages/Carrier/Home'),
            ]);

            const renderRoute = loadModule(cb, 'carrier.home');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
      ],
    },
    {
      path: '/terms',
      name: 'termsPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('../pages/Terms'),
        ]);

        const renderRoute = loadModule(cb, 'terms.page');

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/contact',
      name: 'contactPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('../pages/Contact/reducer'),
          System.import('../pages/Contact/sagas'),
          System.import('../pages/Contact'),
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
      path: '/admin',
      name: 'adminPage',
      onEnter: checkAuth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('../pages/Admin/reducer'),
          System.import('../pages/Admin/sagas'),
          System.import('../pages/Admin'),
        ]);

        const renderRoute = loadModule(cb, 'admin.page');

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('adminPage', reducer.default);
          injectSagas(sagas.default, 'adminPage');
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/team',
      name: 'teamPage',
      onEnter: checkAuth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('../pages/Team/reducer'),
          System.import('../pages/Team/sagas'),
          System.import('../pages/Team'),
        ]);

        const renderRoute = loadModule(cb, 'teams.page');

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('team', reducer.default);
          injectSagas(sagas.default, 'team');
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('../pages/NotFound'),
        ]);

        const renderRoute = loadModule(cb, '404');

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
  ];
}
