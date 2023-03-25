import {
  errorRouteLoading,
  removeSecret,
  requireAuth,
  NotFoundPage,
  loadRouteModule,
  AdminSagas,
  AdminReducer,
  UserProfileSagas,
  Terms,
} from '@benrevo/benrevo-react-core';
import {
  QuoteMainSagas,
  QuoteEnrollmentSagas,
  QuoteOptionsSagas,
  QuoteOverviewSagas,
  QuoteAlternativesSagas,
} from '@benrevo/benrevo-react-quote';
import { DetailPage, MatchSagas, ComparePage } from '@benrevo/benrevo-react-match';
import { getAsyncInjectors } from '../utils/asyncInjectors';
import RFP from './rfp';

export const loadRouteModuleClear = (cb) => (componentModule) => {
  cb(null, componentModule);
};

export const checkClientRoute = () => true;

export const checkPresentationRoute = (nextState, replace, store) => {
  const products = store.getState().get('clients').get('current').get('products').toJS();
  const section = (nextState.routes[4]) ? nextState.routes[4].path : null;
  const redirect = () => {
    for (let i = 0; i < Object.keys(products).length; i += 1) {
      const item = Object.keys(products)[i];

      if (products[item]) {
        replace(`/clients/${nextState.params.clientId}/presentation/${item}`);
        return true;
      }
    }

    return true;
  };
  if (section && products[section] === false) {
    redirect();
  } else if (!section) redirect();

  return true;
};

export const checkAuth = (nextState, replace) => requireAuth(nextState, replace, false);

export default function createRoutes(store) {
  const { injectSagas, injectReducer } = getAsyncInjectors(store);
  const rfpRoutes = RFP(checkAuth, errorRouteLoading, loadRouteModule, loadRouteModuleClear, checkClientRoute, store, injectSagas, injectReducer);

  const data = [
    {
      path: '/',
      onEnter: checkAuth,
      name: 'home',
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
      path: '/admin',
      onEnter: checkAuth,
      name: 'admin',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Admin'),
          import('pages/Admin/sagas'),
          import('pages/Admin/reducer'),
        ]);

        const renderRoute = loadRouteModule(cb, 'admin');

        importModules.then(([component, sagas, reducer]) => {
          injectReducer('admin', AdminReducer);
          injectSagas(sagas.default, 'adminPageSagas');
          injectSagas(AdminSagas, 'admin');
          injectReducer('adminBroker', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorRouteLoading);
      },
    },
    {
      path: '/clients',
      indexRoute: { onEnter: (nextState, replace) => replace('/') },
      name: 'clients',
      childRoutes: [
        {
          path: '/clients/:clientId',
          onEnter: checkAuth,
          name: 'client',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Clients/Client/sagas'),
              import('pages/Admin/sagas'),
              import('pages/Clients/Client/reducer'),
              import('pages/Clients/Client'),
            ]);

            const renderRoute = loadRouteModule(cb, 'clients.client');
            importModules.then(([sagas, adminSagas, reducer, component]) => {
              injectSagas(sagas.default, 'clientSagas');
              injectSagas(adminSagas.default, 'adminPageSagas');
              injectReducer('client', reducer.default);
              renderRoute(component);
            });

            importModules.catch(errorRouteLoading);
          },
          childRoutes: [
            {
              path: 'setup',
              name: 'client.setup',
              getComponent(nextState, cb) {
                const importModules = Promise.all([
                  import('pages/Setup'),
                ]);

                const renderRoute = loadRouteModule(cb, 'client.setup');

                importModules.then(([component]) => {
                  renderRoute(component);
                });

                importModules.catch(errorRouteLoading);
              },
            },
            {
              path: 'build',
              name: 'client.setupPresentation',
              indexRoute: { onEnter: (nextState, replace) => { replace(`/clients/${nextState.params.clientId}/build/setup`); } },
              getComponent(nextState, cb) {
                const importModules = Promise.all([
                  import('pages/SetupPresentation/sagas'),
                  import('pages/SetupPresentation'),
                ]);

                const renderRoute = loadRouteModule(cb, 'client.setupPresentation');

                importModules.then(([sagas, component]) => {
                  injectSagas(sagas.default, 'setupPresentationSagas');
                  renderRoute(component);
                });

                importModules.catch(errorRouteLoading);
              },
              childRoutes: [
                {
                  path: 'setup',
                  name: 'client.setupPresentation.setup',
                  getComponent(nextState, cb) {
                    const importModules = Promise.all([
                      import('pages/SetupPresentation/Setup'),
                    ]);

                    const renderRoute = loadRouteModule(cb, 'client.setupPresentation.setup');

                    importModules.then(([component]) => {
                      renderRoute(component);
                    });

                    importModules.catch(errorRouteLoading);
                  },
                },
                {
                  path: 'download',
                  name: 'client.setupPresentation.download',
                  getComponent(nextState, cb) {
                    const importModules = Promise.all([
                      import('pages/SetupPresentation/Download'),
                    ]);

                    const renderRoute = loadRouteModule(cb, 'client.setupPresentation.download');

                    importModules.then(([component]) => {
                      renderRoute(component);
                    });

                    importModules.catch(errorRouteLoading);
                  },
                },
              ],
            },
            rfpRoutes,
            {
              path: 'presentation',
              onEnter: (nextState, replace) => checkPresentationRoute(nextState, replace, store),
              name: 'presentationPage',
              getComponent(nextState, cb) {
                const importModules = Promise.all([
                  import('pages/Rfp/sagas'),
                  import('pages/Quote/sagas'),
                  import('pages/Quote'),
                  import('pages/Quote/Section/sagas'),
                ]);

                const renderRoute = loadRouteModule(cb, 'presentation');
                injectSagas(QuoteMainSagas, 'presentationPage');
                injectSagas(QuoteEnrollmentSagas, 'presentationPageEnrollment');
                injectSagas(QuoteOptionsSagas, 'presentationPageOptions');
                injectSagas(QuoteOverviewSagas, 'presentationPageOverview');
                injectSagas(QuoteAlternativesSagas, 'alternativesSagas');
                injectSagas(MatchSagas, 'matchSagas');
                importModules.then(([rfpSagas, sagas, component]) => {
                  injectSagas(rfpSagas.default, 'rfp.sagas');
                  injectSagas(sagas.default, 'additionalPresentationSagas');
                  renderRoute(component);
                });

                importModules.catch(errorRouteLoading);
              },
              childRoutes: [
                {
                  path: 'compare',
                  onEnter: checkAuth,
                  getComponent(nextState, cb) {
                    const renderRoute = loadRouteModuleClear(cb, 'presentation.compare');
                    renderRoute(ComparePage);
                  },
                },
                {
                  path: 'medical',
                  onEnter: checkAuth,
                  getComponent(nextState, cb) {
                    const importModules = Promise.all([
                      import('pages/Quote/Section'),
                    ]);

                    const renderRoute = loadRouteModule(cb, 'presentation.medical');
                    importModules.then(([component]) => {
                      renderRoute(component);
                    });

                    importModules.catch(errorRouteLoading);
                  },
                  childRoutes: [
                    {
                      path: 'detail',
                      onEnter: checkAuth,
                      getComponent(nextState, cb) {
                        const renderRoute = loadRouteModuleClear(cb, 'presentation.medical.detail');
                        renderRoute(DetailPage);
                      },
                    },
                  ],
                },
                {
                  path: 'dental',
                  onEnter: checkAuth,
                  getComponent(nextState, cb) {
                    const importModules = Promise.all([
                      import('pages/Quote/Section'),
                    ]);

                    const renderRoute = loadRouteModule(cb, 'presentation.dental');
                    importModules.then(([component]) => {
                      renderRoute(component);
                    });

                    importModules.catch(errorRouteLoading);
                  },
                  childRoutes: [
                    {
                      path: 'detail',
                      onEnter: checkAuth,
                      getComponent(nextState, cb) {
                        const renderRoute = loadRouteModuleClear(cb, 'presentation.dental.detail');
                        renderRoute(DetailPage);
                      },
                    },
                  ],
                },
                {
                  path: 'vision',
                  onEnter: checkAuth,
                  getComponent(nextState, cb) {
                    const importModules = Promise.all([
                      import('pages/Quote/Section'),
                    ]);

                    const renderRoute = loadRouteModule(cb, 'presentation.vision');
                    importModules.then(([component]) => {
                      renderRoute(component);
                    });

                    importModules.catch(errorRouteLoading);
                  },
                  childRoutes: [
                    {
                      path: 'detail',
                      onEnter: checkAuth,
                      getComponent(nextState, cb) {
                        const renderRoute = loadRouteModuleClear(cb, 'presentation.vision.detail');
                        renderRoute(DetailPage);
                      },
                    },
                  ],
                },
                {
                  path: 'life',
                  onEnter: checkAuth,
                  getComponent(nextState, cb) {
                    const importModules = Promise.all([
                      import('pages/Quote/Section'),
                    ]);

                    const renderRoute = loadRouteModule(cb, 'presentation.life');
                    importModules.then(([component]) => {
                      renderRoute(component);
                    });

                    importModules.catch(errorRouteLoading);
                  },
                  childRoutes: [
                    {
                      path: 'detail',
                      onEnter: checkAuth,
                      getComponent(nextState, cb) {
                        const renderRoute = loadRouteModuleClear(cb, 'presentation.life.detail');
                        renderRoute(DetailPage);
                      },
                    },
                  ],
                },
                {
                  path: 'vol_life',
                  onEnter: checkAuth,
                  getComponent(nextState, cb) {
                    const importModules = Promise.all([
                      import('pages/Quote/Section'),
                    ]);

                    const renderRoute = loadRouteModule(cb, 'presentation.vol_life');
                    importModules.then(([component]) => {
                      renderRoute(component);
                    });

                    importModules.catch(errorRouteLoading);
                  },
                  childRoutes: [
                    {
                      path: 'detail',
                      onEnter: checkAuth,
                      getComponent(nextState, cb) {
                        const renderRoute = loadRouteModuleClear(cb, 'presentation.vol_life.detail');
                        renderRoute(DetailPage);
                      },
                    },
                  ],
                },
                {
                  path: 'std',
                  onEnter: checkAuth,
                  getComponent(nextState, cb) {
                    const importModules = Promise.all([
                      import('pages/Quote/Section'),
                    ]);

                    const renderRoute = loadRouteModule(cb, 'presentation.std');
                    importModules.then(([component]) => {
                      renderRoute(component);
                    });

                    importModules.catch(errorRouteLoading);
                  },
                  childRoutes: [
                    {
                      path: 'detail',
                      onEnter: checkAuth,
                      getComponent(nextState, cb) {
                        const renderRoute = loadRouteModuleClear(cb, 'presentation.std.detail');
                        renderRoute(DetailPage);
                      },
                    },
                  ],
                },
                {
                  path: 'vol_std',
                  onEnter: checkAuth,
                  getComponent(nextState, cb) {
                    const importModules = Promise.all([
                      import('pages/Quote/Section'),
                    ]);

                    const renderRoute = loadRouteModule(cb, 'presentation.vol_std');
                    importModules.then(([component]) => {
                      renderRoute(component);
                    });

                    importModules.catch(errorRouteLoading);
                  },
                  childRoutes: [
                    {
                      path: 'detail',
                      onEnter: checkAuth,
                      getComponent(nextState, cb) {
                        const renderRoute = loadRouteModuleClear(cb, 'presentation.vol_std.detail');
                        renderRoute(DetailPage);
                      },
                    },
                  ],
                },
                {
                  path: 'ltd',
                  onEnter: checkAuth,
                  getComponent(nextState, cb) {
                    const importModules = Promise.all([
                      import('pages/Quote/Section'),
                    ]);

                    const renderRoute = loadRouteModule(cb, 'presentation.ltd');
                    importModules.then(([component]) => {
                      renderRoute(component);
                    });

                    importModules.catch(errorRouteLoading);
                  },
                  childRoutes: [
                    {
                      path: 'detail',
                      onEnter: checkAuth,
                      getComponent(nextState, cb) {
                        const renderRoute = loadRouteModuleClear(cb, 'presentation.ltd.detail');
                        renderRoute(DetailPage);
                      },
                    },
                  ],
                },
                {
                  path: 'vol_ltd',
                  onEnter: checkAuth,
                  getComponent(nextState, cb) {
                    const importModules = Promise.all([
                      import('pages/Quote/Section'),
                    ]);

                    const renderRoute = loadRouteModule(cb, 'presentation.vol_ltd');
                    importModules.then(([component]) => {
                      renderRoute(component);
                    });

                    importModules.catch(errorRouteLoading);
                  },
                  childRoutes: [
                    {
                      path: 'detail',
                      onEnter: checkAuth,
                      getComponent(nextState, cb) {
                        const renderRoute = loadRouteModuleClear(cb, 'presentation.vol_ltd.detail');
                        renderRoute(DetailPage);
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: '/setup',
      // onEnter: checkAuth,
      name: 'setup',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Setup'),
        ]);

        const renderRoute = loadRouteModule(cb, 'setup');

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorRouteLoading);
      },
    },
    {
      path: '/login',
      name: 'login',
      onLeave: removeSecret,
      getComponent(nextState, cb) {
        import('pages/Login')
          .then(loadRouteModule(cb, 'login'))
          .catch(errorRouteLoading);
      },
    },
    {
      path: '/profile',
      name: 'profile',
      onEnter: checkAuth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([import('pages/UserProfile')]);

        const renderRoute = loadRouteModule(cb, 'user.profile');

        importModules.then(([component]) => {
          injectSagas(UserProfileSagas, 'userProfile');
          renderRoute(component);
        });

        importModules.catch(errorRouteLoading);
      },
    },
    {
      path: '/terms',
      name: 'termsPage',
      getComponent(nextState, cb) {
        const renderRoute = loadRouteModuleClear(cb, 'terms.page');
        renderRoute(Terms);
      },
    },
    {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        const renderRoute = loadRouteModuleClear(cb, '404');
        renderRoute(NotFoundPage);
      },
    },
  ];

  return data;
}
