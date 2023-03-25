  // These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import {
  commonRoutes,
  requireAuth,
  removeSecret,
  requireUserMetadata,
  UserProfileSagas,
  HomeReducer,
  HomeSagas,
  checkClientRoute,
  errorRouteLoading,
  loadRouteModule,
  loadRouteModuleClear,
} from '@benrevo/benrevo-react-core';
import { setRouteError, selectDirectToPresentation } from '@benrevo/benrevo-react-clients';
import { TimeLineSagas } from '@benrevo/benrevo-react-timeline';
import {
  OnBoarding,
} from '@benrevo/benrevo-react-onboarding';
import {
  Presentation,
  Enrollment,
  Documents,
  QuoteMainSagas,
  QuoteEnrollmentSagas,
  QuoteOptionsSagas,
  QuoteOverviewSagas,
  QuoteAlternativesSagas,
} from '@benrevo/benrevo-react-quote';
import OnBoardingPages from './onboarding';
import RFP from './rfp';
import { getAsyncInjectors } from '../utils/asyncInjectors';

export const checkAuth = (nextState, replace) => requireAuth(nextState, replace);

export default function createRoutes(store) {
  // create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store);
  const onBoardingRoutes = OnBoardingPages(checkAuth, errorRouteLoading, loadRouteModule, loadRouteModuleClear);
  const rfpRoutes = RFP(checkAuth, errorRouteLoading, loadRouteModule, loadRouteModuleClear, checkClientRoute, store, injectSagas, injectReducer);
  const timeline = {
    path: '/timeline/:clientId',
    name: 'timelinePage',
    onEnter: checkAuth,
    getComponent(nextState, cb) {
      const importModules = Promise.all([
        import('pages/Timeline'),
      ]);

      const renderRoute = loadRouteModule(cb, 'timeline');

      importModules.then(([component]) => {
        renderRoute(component);
      });
      injectSagas(TimeLineSagas, 'timelinePage');
      importModules.catch(errorRouteLoading);
    },
  };
  const home = [];
  const privacy = [];

  privacy.push(import('pages/Privacy'));
  home.push(import('pages/Home'));

  let routes = [
    {
      path: '/',
      name: 'home',
      onEnter: requireUserMetadata,
      getComponent(nextState, cb) {
        const importModules = Promise.all(home);
        const renderRoute = loadRouteModule(cb, 'home');

        importModules.then(([component]) => {
          injectReducer('home', HomeReducer);
          injectSagas(HomeSagas, 'home');

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
        const importModules = Promise.all([
          import('pages/Login'),
        ]);

        const renderRoute = loadRouteModule(cb, 'login');
        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorRouteLoading);
      },
    },
    {
      path: '/profile',
      name: 'profile',
      onEnter: checkAuth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/UserProfile'),
        ]);

        const renderRoute = loadRouteModule(cb, 'user.profile');

        importModules.then(([component]) => {
          injectSagas(UserProfileSagas, 'userProfile');
          renderRoute(component);
        });

        importModules.catch(errorRouteLoading);
      },
    },
    {
      path: '/clients',
      name: 'clientPage',
      onEnter: checkAuth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Client'),
        ]);

        const renderRoute = loadRouteModule(cb, 'clients');

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorRouteLoading);
      },
    },
    {
      path: '/clients/export',
      name: 'exportClient',
      onEnter: checkAuth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Client/Export'),
        ]);

        const renderRoute = loadRouteModule(cb, 'clients.exportClient');
        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorRouteLoading);
      },
    },
    {
      path: '/clients/import',
      name: 'importClient',
      onEnter: checkAuth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Client/Import'),
        ]);

        const renderRoute = loadRouteModule(cb, 'clients.importClient');
        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorRouteLoading);
      },
    },
    {
      path: '/onboarding',
      onEnter: (nextState, replace) => checkClientRoute(nextState, replace, store, 'onboarding', setRouteError, selectDirectToPresentation),
      indexRoute: { onEnter: (nextState, replace) => replace('onboarding/administrative/section1') },
      name: 'OnBoardingPage',
      getComponent(nextState, cb) {
        const renderRoute = loadRouteModuleClear(cb, 'onBoarding');
        const importModules = Promise.all([
          import('pages/OnBoarding/sagas'),
        ]);
        importModules.then(([sagas]) => {
          injectSagas(sagas.default, 'onBoarding');
        });

        renderRoute(OnBoarding);

        importModules.catch(errorRouteLoading);
      },
      childRoutes: [
        ...onBoardingRoutes,
        {
          path: 'send',
          name: 'send',
          onEnter: checkAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/OnBoarding/Send'),
            ]);

            const renderRoute = loadRouteModule(cb, 'onBoarding.send');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorRouteLoading);
          },
        },
        {
          path: 'employer-app',
          name: 'employerApplication',
          onEnter: checkAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/OnBoarding/EmployerApp'),
            ]);
            const renderRoute = loadRouteModule(cb, 'onBoarding.employerApp');
            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorRouteLoading);
          },
        },
      ],
    },
    {
      path: '/presentation/:clientId',
      indexRoute: { onEnter: (nextState, replace) => replace(`${nextState.location.pathname}/quote`) },
      name: 'presentationPage',
      getComponent(nextState, cb) {
        const renderRoute = loadRouteModuleClear(cb, 'presentation');
        injectSagas(QuoteMainSagas, 'presentationPage');
        injectSagas(QuoteEnrollmentSagas, 'presentationPageEnrollment');
        injectSagas(QuoteOptionsSagas, 'presentationPageOptions');
        injectSagas(QuoteOverviewSagas, 'presentationPageOverview');
        injectSagas(QuoteAlternativesSagas, 'presentationPageAlternatives');
        renderRoute(Presentation);
      },
      childRoutes: [
        {
          path: 'quote',
          onEnter: checkAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Quote/QuotePage'),
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
          onEnter: checkAuth,
          getComponent(nextState, cb) {
            const renderRoute = loadRouteModuleClear(cb, 'presentation.documents');
            renderRoute(Documents);
          },
        },
        {
          path: 'enrollment',
          onEnter: checkAuth,
          getComponent(nextState, cb) {
            const renderRoute = loadRouteModuleClear(cb, 'presentation.enrollment');
            renderRoute(Enrollment);
          },
        },
        {
          path: 'medical',
          onEnter: checkAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Quote/SectionPage'),
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
          onEnter: checkAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Quote/SectionPage'),
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
          onEnter: checkAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Quote/SectionPage'),
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
          onEnter: checkAuth,
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('pages/Quote/FinalPage'),
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
    rfpRoutes,
    {
      path: '/privacy',
      name: 'privacyPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all(privacy);

        const renderRoute = loadRouteModule(cb, 'privacy.page');

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorRouteLoading);
      },
    },
  ];

  routes = routes.concat(commonRoutes(store, injectReducer, injectSagas));

  routes.unshift(timeline);

  return routes;
}
