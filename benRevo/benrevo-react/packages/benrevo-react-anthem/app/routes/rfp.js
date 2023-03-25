import {
  RFPSection,
  Team,
  Preview,
} from '@benrevo/benrevo-react-rfp';
import { TeamReducer, TeamSagas } from '@benrevo/benrevo-react-core';
import { setRouteError, selectDirectToPresentation } from '@benrevo/benrevo-react-clients';

const createRoutes = (requireAuth, errorLoading, loadModule, loadModuleClear, checkClientRoute, store, injectSagas, injectReducer) => {
  let rfpClientRedirect = 'information';
  const products = store.getState().get('clients').get('products');
  const mainSections = {
    medical: {
      path: 'medical',
      name: 'rfpMedical',
      onEnter: requireAuth,
      indexRoute: { onEnter: (nextState, replace) => replace('/rfp/medical/information') },
      getComponent(nextState, cb) {
        const renderRoute = loadModuleClear(cb, 'rfp.medical');
        renderRoute(RFPSection);
      },
      childRoutes: [],
    },
    dental: {
      path: 'dental',
      name: 'rfpDental',
      onEnter: requireAuth,
      indexRoute: { onEnter: (nextState, replace) => replace('/rfp/dental/information') },
      getComponent(nextState, cb) {
        const renderRoute = loadModuleClear(cb, 'rfp.dental');
        renderRoute(RFPSection);
      },
      childRoutes: [],
    },
    vision: {
      path: 'vision',
      name: 'rfpVision',
      onEnter: requireAuth,
      indexRoute: { onEnter: (nextState, replace) => replace('/rfp/vision/information') },
      getComponent(nextState, cb) {
        const renderRoute = loadModuleClear(cb, 'rfp.vision');
        renderRoute(RFPSection);
      },
      childRoutes: [],
    },
    life: {
      path: 'life',
      name: 'rfpLife',
      onEnter: requireAuth,
      indexRoute: { onEnter: (nextState, replace) => replace('/rfp/life/information') },
      getComponent(nextState, cb) {
        const renderRoute = loadModuleClear(cb, 'rfp.life');
        renderRoute(RFPSection);
      },
      childRoutes: [],
    },
    std: {
      path: 'std',
      name: 'rfpSTD',
      onEnter: requireAuth,
      indexRoute: { onEnter: (nextState, replace) => replace('/rfp/std/information') },
      getComponent(nextState, cb) {
        const renderRoute = loadModuleClear(cb, 'rfp.std');
        renderRoute(RFPSection);
      },
      childRoutes: [],
    },
    ltd: {
      path: 'ltd',
      name: 'rfpLTD',
      onEnter: requireAuth,
      indexRoute: { onEnter: (nextState, replace) => replace('/rfp/ltd/information') },
      getComponent(nextState, cb) {
        const renderRoute = loadModuleClear(cb, 'rfp.ltd');
        renderRoute(RFPSection);
      },
      childRoutes: [],
    },
  };
  const RFPClient = [
    {
      path: 'information',
      onEnter: requireAuth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Rfp/Client/Info'),
        ]);
        const renderRoute = loadModule(cb, 'rfp.client.information');
        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: 'products',
      onEnter: requireAuth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Rfp/Client/Products'),
        ]);

        const renderRoute = loadModule(cb, 'rfp.client.products');
        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
  ];
  const RFPEnro = {
    path: 'enrollment',
    name: 'rfpEnro',
    onEnter: requireAuth,
    indexRoute: { onEnter: (nextState, replace) => replace('/rfp/enrollment/medical') },
    getComponent(nextState, cb) {
      const renderRoute = loadModuleClear(cb, 'rfp.enrollment');
      renderRoute(RFPSection);
    },
    childRoutes: [],
  };
  const RFPRates = {
    path: 'rates',
    name: 'rfpRates',
    onEnter: (nextState, replace) => checkClientRoute(nextState, replace, store, 'rfp', setRouteError, selectDirectToPresentation),
    indexRoute: { onEnter: (nextState, replace) => replace('/rfp/rates/medical') },
    getComponent(nextState, cb) {
      const renderRoute = loadModuleClear(cb, 'rfp.rates');
      renderRoute(RFPSection);
    },
    childRoutes: [],
  };
  const RFPTeams = {
    path: 'team',
    name: 'teamPage',
    onEnter: requireAuth,
    getComponent(nextState, cb) {
      const renderRoute = loadModuleClear(cb, 'rfp.Team');

      injectReducer('team', TeamReducer);
      injectSagas(TeamSagas, 'team');

      renderRoute(Team);
    },
  };
  const RFPCarriers = {
    path: 'send-to-carrier',
    name: 'sendToCarrier',
    onEnter: requireAuth,
    getComponent(nextState, cb) {
      const importModules = Promise.all([
        import('pages/Rfp/Carrier'),
      ]);

      const renderRoute = loadModule(cb, 'rfp.sendToCarrier');
      importModules.then(([component]) => {
        renderRoute(component);
      });

      importModules.catch(errorLoading);
    },
  };
  const RFPPreview = {
    path: 'preview',
    name: 'previewRfp',
    onEnter: requireAuth,
    getComponent(nextState, cb) {
      const renderRoute = loadModuleClear(cb, 'rfp.preview');

      renderRoute(Preview);
    },
  };
  const routes = {
    path: '/rfp',
    onEnter: (nextState, replace) => checkClientRoute(nextState, replace, store, 'rfp', setRouteError, selectDirectToPresentation),
    indexRoute: { onEnter: (nextState, replace) => replace('/rfp/medical') },
    name: 'rfpPage',
    getComponent(nextState, cb) {
      const importModules = Promise.all([
        import('pages/Rfp/sagas'),
        import('pages/Rfp'),
      ]);

      const renderRoute = loadModule(cb);
      importModules.then(([sagas, component]) => {
        injectSagas(sagas.default, 'rfp.sagas');
        renderRoute(component);
      });

      importModules.catch(errorLoading);
    },
    childRoutes: [
      {
        path: 'client',
        name: 'rfpClient',
        onEnter: requireAuth,
        indexRoute: { onEnter: (nextState, replace) => replace(`/rfp/client/${rfpClientRedirect}`) },
        getComponent(nextState, cb) {
          const renderRoute = loadModuleClear(cb, 'rfp.client');
          renderRoute(RFPSection);
        },
        childRoutes: RFPClient,
      },
    ],
  };

  const addChild = (route, comp, key, section) => {
    route.childRoutes.push(
      {
        path: key,
        onEnter: (nextState, replace) => checkClientRoute(nextState, replace, store, 'rfp', setRouteError, selectDirectToPresentation),
        getComponent(nextState, cb) {
          const importModules = Promise.all(comp);

          const renderRoute = loadModule(cb, `rfp.${section}.${key}`);
          importModules.then(([component]) => {
            renderRoute(component);
          });

          importModules.catch(errorLoading);
        },
      }
    );
  };

  products.keySeq().forEach((key) => {
    if (key === 'medical' || key === 'dental' || key === 'vision') addChild(RFPEnro, [import('pages/Rfp/EnroRates')], key, 'enro');
    if (key === 'medical' || key === 'dental' || key === 'vision') addChild(RFPRates, [import('pages/Rfp/CaptureRates')], key, 'rates');
    else addChild(RFPRates, [import('pages/Rfp/LifeStdLtdRates')], key, 'rates');

    addChild(mainSections[key], [import('pages/Rfp/Info')], 'information', key);
    if (key === 'medical' || key === 'dental' || key === 'vision') {
      addChild(mainSections[key], [import('pages/Rfp/Options')], 'options', key);
      addChild(mainSections[key], [import('pages/Rfp/Contribution')], 'contribution', key);
    } else {
      addChild(mainSections[key], [import('pages/Rfp/LifeStdLtdOptions')], 'options', key);
    }
    addChild(mainSections[key], [import('pages/Rfp/Quote')], 'quote', key);

    routes.childRoutes.push(mainSections[key]);
    return true;
  });

  routes.childRoutes.push(RFPRates);
  routes.childRoutes.push(RFPEnro);
  rfpClientRedirect = 'quote-type';
  RFPClient.unshift(
    {
      path: 'quote-type',
      onEnter: requireAuth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Rfp/Client/Quote'),
        ]);

        const renderRoute = loadModule(cb, 'rfp.client.quote');
        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }
  );
  routes.childRoutes.push(RFPTeams);
  routes.childRoutes.push(RFPCarriers);
  routes.childRoutes.push(RFPPreview);

  return routes;
};

export default createRoutes;
