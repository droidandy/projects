// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { requireAuth, removeSecret } from 'utils/authService/lib';
import { getAsyncInjectors } from './utils/asyncInjectors';
import { setRouteError } from './pages/Client/actions';
import * as accountActions from './pages/Accounts/actions';
import { selectedCarrier } from './config';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

function checkClientRoute(nextState, replace, store) {
  const baseState = store.getState().get('base').toJS();
  if (!baseState.selectedCarrier.carrierId || !baseState.selectedClient.id || !baseState.currentBroker.id) {
    store.dispatch(setRouteError(true));
    replace({
      pathname: '/client',
      state: { nextPathname: nextState.location.pathname },
    });
  } else store.dispatch(setRouteError(false));
}

function checkAccountsRoute(nextState, replace, store) {
  const current = store.getState().get('accountsPage').get('current').toJS();
  if (!current.id) {
    store.dispatch(accountActions.setRouteError(true));
    replace({
      pathname: '/accounts',
      state: { nextPathname: nextState.location.pathname },
    });
  } else store.dispatch(accountActions.setRouteError(false));
}

export default function createRoutes(store) {
  const { injectReducer, injectSagas } = getAsyncInjectors(store);
  const anthem = {
    path: '/clear-value',
    name: 'clearValue',
    indexRoute: { onEnter: (nextState, replace) => replace('/clear-value/calculator') },
    getComponent(nextState, cb) {
      const importModules = Promise.all([
        import('pages/Anthem'),
      ]);

      const renderRoute = loadModule(cb);

      importModules.then(([component]) => {
        renderRoute(component);
      });

      importModules.catch(errorLoading);
    },
    childRoutes: [
      {
        path: 'calculator',
        onEnter: requireAuth,
        getComponent(nextState, cb) {
          const importModules = Promise.all([
            import('pages/Anthem/ClearValue'),
            import('pages/Anthem/ClearValue/sagas'),
          ]);

          const renderRoute = loadModule(cb, 'plans.clear-value.calculator');
          importModules.then(([component, sagas]) => {
            renderRoute(component);
            injectSagas(sagas.default, 'clearValuePage');
          });

          importModules.catch(errorLoading);
        },
      },
    ],
  };

  const data = [
    {
      path: '/',
      onEnter: requireAuth,
      indexRoute: { onEnter: (nextState, replace) => replace('/client') },
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
      path: '/brokerage',
      onEnter: requireAuth,
      name: 'brokerage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Brokerage'),
          import('pages/Brokerage/sagas'),
        ]);

        const renderRoute = loadModule(cb, 'brokerage');

        importModules.then(([component, sagasBrokerage]) => {
          renderRoute(component);
          injectSagas(sagasBrokerage.default, 'brokeragePage');
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/plan-design',
      name: 'planDesign',
      indexRoute: { onEnter: (nextState, replace) => replace('/plan-design/upload') },
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/PlanDesign/sagas'),
          import('pages/PlanDesign'),
        ]);

        const renderRoute = loadModule(cb);
        importModules.then(([sagas, component]) => {
          injectSagas(sagas.default, 'planDesign');
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
      childRoutes: [
        {
          path: 'upload',
          onEnter: requireAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/PlanDesign/UploadPlanDesign'),
            ]);

            const renderRoute = loadModule(cb, 'planDesign.upload');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: 'view',
          onEnter: requireAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/PlanDesign/ViewPlanDesign'),
            ]);

            const renderRoute = loadModule(cb, 'planDesign.view');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
      ],
    },
    {
      path: '/client',
      onEnter: requireAuth,
      name: 'client',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Client'),
          import('pages/Plans/sagas'),
          import('pages/Plans/Submit/sagas'),
        ]);

        const renderRoute = loadModule(cb, 'client');

        importModules.then(([component, sagasPlans, sagasSubmit]) => {
          renderRoute(component);
          injectSagas(sagasPlans.default, 'plansPage');
          injectSagas(sagasSubmit.default, 'plansSubmitPage');
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/login',
      name: 'login',
      onLeave: removeSecret,
      getComponent(nextState, cb) {
        System.import('pages/Login')
          .then(loadModule(cb, 'login'))
          .catch(errorLoading);
      },
    },
    {
      path: '/client/plans',
      name: 'plansClient',
      onEnter: (nextState, replace) => checkClientRoute(nextState, replace, store),
      indexRoute: { onEnter: (nextState, replace) => replace('/client/plans/data') },
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Plans'),
          import('pages/Plans/sagas'),
          import('pages/Plans/Submit/sagas'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component, sagasPlans, sagasSubmit]) => {
          renderRoute(component);
          injectSagas(sagasPlans.default, 'plansPage');
          injectSagas(sagasSubmit.default, 'plansSubmitPage');
        });

        importModules.catch(errorLoading);
      },
      childRoutes: [
        {
          path: 'data',
          onEnter: requireAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Plans/Data'),
            ]);

            const renderRoute = loadModule(cb, 'plans.data');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: 'accounts',
          onEnter: requireAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Plans/CreateAccounts'),
            ]);

            const renderRoute = loadModule(cb, 'plans.accounts');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: 'contribution',
          onEnter: requireAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Plans/PresentationData'),
            ]);

            const renderRoute = loadModule(cb, 'plans.contribution');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: 'files',
          onEnter: requireAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Plans/Files'),
            ]);

            const renderRoute = loadModule(cb, 'plans.files');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: 'medical',
          onEnter: requireAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Plans/Medical'),
            ]);

            const renderRoute = loadModule(cb, 'plans.medical');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: 'dental',
          onEnter: requireAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Plans/Dental'),
            ]);

            const renderRoute = loadModule(cb, 'plans.dental');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: 'vision',
          onEnter: requireAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Plans/Vision'),
            ]);

            const renderRoute = loadModule(cb, 'plans.vision');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: 'quote',
          onEnter: requireAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Plans/Submit'),
            ]);

            const renderRoute = loadModule(cb, 'plans.quote');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: 'decline',
          onEnter: requireAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Plans/Decline/sagas'),
              import('pages/Plans/Decline'),
            ]);

            const renderRoute = loadModule(cb, 'plans.decline');
            importModules.then(([sagas, component]) => {
              injectSagas(sagas.default, 'plansDeclinePage');
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
      ],
    },
    {
      path: 'client/plans/review',
      onEnter: (nextState, replace) => checkClientRoute(nextState, replace, store),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Plans/Review'),
        ]);

        const renderRoute = loadModule(cb, 'plans.review');
        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: 'client/plans/quote-preview',
      onEnter: (nextState, replace) => checkClientRoute(nextState, replace, store),
      indexRoute: { onEnter: (nextState, replace) => replace('/client/plans/quote-preview/medical') },
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Plans/PlansQuotePreview'),
        ]);

        const renderRoute = loadModule(cb, 'plans.quote-preview');
        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
      childRoutes: [
        {
          path: 'medical',
          onEnter: requireAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Plans/QuotePreview'),
            ]);

            const renderRoute = loadModule(cb, 'plans.quote-preview.medical');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: 'kaiser',
          onEnter: requireAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Plans/QuotePreview'),
            ]);

            const renderRoute = loadModule(cb, 'plans.quote-preview.kaiser');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: 'dental',
          onEnter: requireAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Plans/QuotePreview'),
            ]);

            const renderRoute = loadModule(cb, 'plans.quote-preview.dental');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: 'vision',
          onEnter: requireAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Plans/QuotePreview'),
            ]);

            const renderRoute = loadModule(cb, 'plans.quote-preview.vision');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
      ],
    },
    {
      path: '/accounts',
      name: 'Accounts',
      onEnter: requireAuth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Accounts/sagas'),
          import('pages/Accounts'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([sagas, component]) => {
          injectSagas(sagas.default, 'accountsPage');
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
      childRoutes: [
        {
          path: 'details',
          onEnter: (nextState, replace) => checkAccountsRoute(nextState, replace, store),
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Accounts/Details'),
            ]);

            const renderRoute = loadModule(cb, 'accounts.details');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: 'details/deny',
          onEnter: (nextState, replace) => checkAccountsRoute(nextState, replace, store),
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Accounts/Deny'),
            ]);

            const renderRoute = loadModule(cb, 'accounts.deny');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
      ],
    },
    {
      path: '/data-access',
      name: 'DataAccess',
      onEnter: requireAuth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/DataAccess/sagas'),
          import('pages/DataAccess'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([sagas, component]) => {
          injectSagas(sagas.default, 'dataAccessPage');
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
      childRoutes: [],
    },
    {
      path: '/sales',
      name: 'sales',
      indexRoute: { onEnter: (nextState, replace) => replace('/sales/persons') },
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Sales/sagas'),
          import('pages/Sales'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([sagas, component]) => {
          injectSagas(sagas.default, 'sales');
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
      childRoutes: [
        {
          path: 'persons',
          onEnter: requireAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Sales/Persons'),
            ]);

            const renderRoute = loadModule(cb, 'sales.persons');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: 'add',
          onEnter: requireAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Sales/AddPerson'),
            ]);

            const renderRoute = loadModule(cb, 'sales.addPerson');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: 'brokerage',
          onEnter: requireAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Sales/Brokerage'),
            ]);

            const renderRoute = loadModule(cb, 'sales.brokerage');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
      ],
    },
    {
      path: '/carrier-files',
      name: 'CarrierFiles',
      onEnter: requireAuth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/CarrierFiles/reducerFiles'),
          import('pages/CarrierFiles/sagas'),
          import('pages/CarrierFiles'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducerFiles, sagas, component]) => {
          injectReducer('carrierFilesBlob', reducerFiles.default);
          injectSagas(sagas.default, 'carrierFilesPage');
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
      childRoutes: [],
    },
    {
      path: '/optimizer',
      name: 'Optimizer',
      onEnter: requireAuth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Optimizer/sagas'),
          import('pages/Optimizer'),
        ]);

        const renderRoute = loadModule(cb, 'optimizer');

        importModules.then(([sagas, component]) => {
          injectSagas(sagas.default, 'optimizer');
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

  if (selectedCarrier.value === 'ANTHEM_BLUE_CROSS') {
    data.unshift(anthem);
  }
  return data;
}
