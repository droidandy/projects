import {
  errorRouteLoading,
} from '@benrevo/benrevo-react-core';
import {
  Enrollment,
  QuoteMainSagas,
  QuoteEnrollmentSagas,
  QuoteOptionsSagas,
  QuoteOverviewSagas,
  QuoteAlternativesSagas,
} from '@benrevo/benrevo-react-quote';
import { MatchSagas } from '@benrevo/benrevo-react-match';
import { removeSecret, requireAuth } from 'utils/authService/lib';
import Client from '../pages/Client';
import { changeAccessStatus } from '../pages/Client/Details/actions';
import { ACCESS_STATUS_STOP, ACCESS_STATUS_START } from '../pages/Client/Details/constants';
import { getAsyncInjectors } from '../utils/asyncInjectors';
import { CARRIER } from '../config';
import RFP from './rfp';

export const loadRouteModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export const loadRouteModuleClear = (cb) => (componentModule) => {
  cb(null, componentModule);
};

export function checkClientRoute(nextState, replace, store) {
  if (requireAuth(nextState, replace)) {
    const clientId = nextState.params.clientId;
    const client = store.getState().get('clientDetails').get('current').toJS();
    const accessStatus = store.getState().get('clientDetails').get('accessStatus');
    const accessTrue = (client.clientId) ? client.clientId.toString() === clientId : false;
    if (!accessTrue && clientId && client.clientId && accessStatus !== ACCESS_STATUS_STOP) {
      store.dispatch(changeAccessStatus(ACCESS_STATUS_STOP));
      replace({
        pathname: `/client/${clientId}`,
      });
    } else if (accessStatus === ACCESS_STATUS_START && !nextState.routes[3].path && accessTrue && clientId) {
      replace({
        pathname: `/client/${clientId}/quote`,
      });
    } else if (accessStatus !== ACCESS_STATUS_START && clientId && nextState.routes[3].path) {
      replace({
        pathname: `/client/${clientId}`,
      });
    }
  }
}

export default function createRoutes(store) {
  const { injectSagas } = getAsyncInjectors(store);
  const rewards = {
    path: '/rewards',
    onEnter: requireAuth,
    name: 'rewards',
    getComponent(nextState, cb) {
      const importModules = Promise.all([
        import('pages/Rewards/sagas'),
        import('pages/Rewards'),
      ]);

      const renderRoute = loadRouteModule(cb, 'rewards');

      importModules.then(([sagas, component]) => {
        injectSagas(sagas.default, 'rewards.sagas');
        renderRoute(component);
      });

      importModules.catch(errorRouteLoading);
    },
  };
  const rfpRoutes = RFP(requireAuth, errorRouteLoading, loadRouteModule, loadRouteModuleClear, store);

  const data = [
    {
      path: '/',
      onEnter: requireAuth,
      name: 'home',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Home/sagas'),
          import('pages/Home'),
        ]);

        const renderRoute = loadRouteModule(cb, 'home');

        importModules.then(([sagas, component]) => {
          injectSagas(sagas.default, 'home.sagas');
          renderRoute(component);
        });

        importModules.catch(errorRouteLoading);
      },
    },
    {
      path: '/clients',
      onEnter: requireAuth,
      name: 'clients',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Clients'),
        ]);

        const renderRoute = loadRouteModule(cb, 'clients');

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorRouteLoading);
      },
    },
    {
      path: '/prequote',
      onEnter: requireAuth,
      name: 'prequote',
      indexRoute: { onEnter: (nextState, replace) => replace(`${nextState.location.pathname}/clients`) },
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Prequote'),
        ]);

        const renderRoute = loadRouteModule(cb, 'prequote');
        injectSagas(MatchSagas, 'matchSagas');
        injectSagas(QuoteMainSagas, 'presentationPage');
        injectSagas(QuoteOptionsSagas, 'presentationPageOptions');
        injectSagas(QuoteOverviewSagas, 'presentationPageOverview');
        injectSagas(QuoteAlternativesSagas, 'presentationPageAlternatives');
        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorRouteLoading);
      },
      childRoutes: [
        {
          path: 'clients',
          onEnter: requireAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Prequote/ClientsList/sagas'),
              import('pages/Prequote/sagas'),
              import('pages/Prequote/Rater/sagas'),
              import('pages/Prequote/RateProduct/sagas'),
              import('pages/Prequote/Send/sagas'),
              import('pages/Prequote/ClientsList'),
            ]);

            const renderRoute = loadRouteModule(cb, 'prequote.clients');
            importModules.then(([sagas, rfpSagas, raterSagas, rateProductSagas, sendSagas, component]) => {
              injectSagas(sagas.default, 'prequote.clients.sagas');
              injectSagas(rfpSagas.default, 'prequote.clients.rfp.sagas');
              injectSagas(raterSagas.default, 'prequote.clients.rater');
              injectSagas(rateProductSagas.default, 'prequote.clients.rateProduct');
              injectSagas(sendSagas.default, 'prequote.clients.send');
              renderRoute(component);
            });

            importModules.catch(errorRouteLoading);
          },
          childRoutes: [
            {
              path: 'new',
              indexRoute: { onEnter: (nextState, replace) => replace(`${nextState.location.pathname}/client`) },
              getComponent(nextState, cb) {
                const importModules = Promise.all([
                  import('pages/Prequote/Client'),
                ]);

                const renderRoute = loadRouteModule(cb, 'prequote.clients.newClient');
                importModules.then(([component]) => {
                  renderRoute(component);
                });

                importModules.catch(errorRouteLoading);
              },
              childRoutes: rfpRoutes,
            },
            {
              path: ':clientId',
              indexRoute: { onEnter: (nextState, replace) => replace(`${nextState.location.pathname}/client`) },
              getComponent(nextState, cb) {
                const importModules = Promise.all([
                  import('pages/Prequote/Client'),
                ]);

                const renderRoute = loadRouteModule(cb, 'prequote.clients.client');
                importModules.then(([component]) => {
                  renderRoute(component);
                });

                importModules.catch(errorRouteLoading);
              },
              childRoutes: rfpRoutes,
            },
          ],
        },
      ],
    },
    {
      path: '/client',
      onEnter: (nextState, replace) => checkClientRoute(nextState, replace, store),
      name: 'presentationPage',
      getComponent(nextState, cb) {
        const renderRoute = loadRouteModuleClear(cb, 'presentation');
        injectSagas(QuoteMainSagas, 'presentationPage');
        injectSagas(QuoteEnrollmentSagas, 'presentationPageEnrollment');
        injectSagas(QuoteOptionsSagas, 'presentationPageOptions');
        injectSagas(QuoteOverviewSagas, 'presentationPageOverview');
        injectSagas(QuoteAlternativesSagas, 'presentationPageAlternatives');
        renderRoute(Client);
      },
      childRoutes: [
        {
          path: ':clientId',
          name: 'clientPage',
          // onEnter: requireAuth,
          indexRoute: { onEnter: (nextState, replace) => checkClientRoute(nextState, replace, store) },
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Client/Details/sagas'),
              import('pages/Client/Details'),
            ]);

            const renderRoute = loadRouteModule(cb, 'client.details');

            importModules.then(([sagas, component]) => {
              injectSagas(sagas.default, 'client.details.sagas');
              renderRoute(component);
            });

            importModules.catch(errorRouteLoading);
          },
          childRoutes: [
            {
              path: 'quote',
              onEnter: requireAuth,
              getComponent(nextState, cb) {
                const importModules = Promise.all([
                  import('pages/Client/Quote/QuotePage'),
                ]);

                const renderRoute = loadRouteModule(cb, 'presentation.quote');
                importModules.then(([component]) => {
                  renderRoute(component);
                });

                importModules.catch(errorRouteLoading);
              },
            },
            {
              path: 'documents',
              onEnter: requireAuth,
              getComponent(nextState, cb) {
                const importModules = Promise.all([
                  import('pages/Client/Quote/DocumentPage'),
                ]);

                const renderRoute = loadRouteModule(cb, 'presentation.documents');
                importModules.then(([component]) => {
                  renderRoute(component);
                });

                importModules.catch(errorRouteLoading);
              },
            },
            {
              path: 'enrollment',
              onEnter: requireAuth,
              getComponent(nextState, cb) {
                const renderRoute = loadRouteModuleClear(cb, 'presentation.enrollment');
                renderRoute(Enrollment);
              },
            },
            {
              path: 'medical',
              onEnter: requireAuth,
              getComponent(nextState, cb) {
                const importModules = Promise.all([
                  import('pages/Client/Quote/SectionPage'),
                ]);

                const renderRoute = loadRouteModule(cb, 'presentation.medical');
                importModules.then(([component]) => {
                  renderRoute(component);
                });

                importModules.catch(errorRouteLoading);
              },
            },
            {
              path: 'dental',
              onEnter: requireAuth,
              getComponent(nextState, cb) {
                const importModules = Promise.all([
                  import('pages/Client/Quote/SectionPage'),
                ]);

                const renderRoute = loadRouteModule(cb, 'presentation.dental');
                importModules.then(([component]) => {
                  renderRoute(component);
                });

                importModules.catch(errorRouteLoading);
              },
            },
            {
              path: 'vision',
              onEnter: requireAuth,
              getComponent(nextState, cb) {
                const importModules = Promise.all([
                  import('pages/Client/Quote/SectionPage'),
                ]);

                const renderRoute = loadRouteModule(cb, 'presentation.vision');
                importModules.then(([component]) => {
                  renderRoute(component);
                });

                importModules.catch(errorRouteLoading);
              },
            },
            {
              path: 'final',
              onEnter: requireAuth,
              getComponent(nextState, cb) {
                const importModules = Promise.all([
                  import('pages/Client/Quote/FinalPage'),
                ]);

                const renderRoute = loadRouteModule(cb, 'presentation.final');
                importModules.then(([component]) => {
                  renderRoute(component);
                });

                importModules.catch(errorRouteLoading);
              },
            },
          ],
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      onLeave: removeSecret,
      getComponent(nextState, cb) {
        System.import('pages/Login')
          .then(loadRouteModule(cb, 'login'))
          .catch(errorRouteLoading);
      },
    },
    {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        import('pages/NotFound')
          .then(loadRouteModule(cb, '404'))
          .catch(errorRouteLoading);
      },
    },
  ];

  if (CARRIER === 'ANTHEM') data.unshift(rewards);

  return data;
}
