import { TeamReducer, TeamSagas } from '@benrevo/benrevo-react-core';
import { setRouteError, selectDirectToPresentation } from '@benrevo/benrevo-react-clients';
import RFPSection from '../pages/Rfp/Section';
import PreviewWrap from '../pages/Rfp/Preview/Preview';

const redirect = (nextState, replace, end) => {
  const { clientId } = nextState.params;
  if (clientId) replace(`/clients/${clientId}/rfp/${end}`);
  else replace('/clients');
};

const createRoutes = (requireAuth, errorLoading, loadModule, loadModuleClear, checkClientRoute, store, injectSagas, injectReducer) => {
  const rfpClientRedirect = 'information';
  const products = store.getState().get('clients').get('products');
  const mainSections = {
    medical: {
      path: 'medical',
      name: 'rfpMedical',
      onEnter: requireAuth,
      indexRoute: { onEnter: (nextState, replace) => redirect(nextState, replace, 'medical/information') },
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
      indexRoute: { onEnter: (nextState, replace) => redirect(nextState, replace, 'dental/information') },
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
      indexRoute: { onEnter: (nextState, replace) => redirect(nextState, replace, 'vision/information') },
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
      indexRoute: { onEnter: (nextState, replace) => redirect(nextState, replace, 'life/information') },
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
      indexRoute: { onEnter: (nextState, replace) => redirect(nextState, replace, 'std/information') },
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
      indexRoute: { onEnter: (nextState, replace) => redirect(nextState, replace, 'ltd/information') },
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
  ];
  const RFPEnro = {
    path: 'enrollment',
    name: 'rfpEnro',
    onEnter: (nextState, replace) => {
      const currentProducts = store.getState().get('clients').get('current').get('products').toJS();
      const currentSection = nextState.routes[5].path;
      if (currentProducts[currentSection] === false && nextState.routes[5].path === currentSection) {
        const filteredSections = Object.keys(currentProducts).filter((key) => currentProducts[key] ? key : false);
        redirect(nextState, replace, `enrollment/${filteredSections[0]}`);
      }
      checkClientRoute(nextState, replace, store, 'rfp', setRouteError, selectDirectToPresentation);
    },
    indexRoute: {
      onEnter: (nextState, replace) => {
        const currentProducts = store.getState().get('clients').get('current').get('products').toJS();
        if (currentProducts.medical) {
          redirect(nextState, replace, 'enrollment/medical');
        } else {
          redirect(nextState, replace, 'enrollment/dental');
        }
      },
    },
    getComponent(nextState, cb) {
      const renderRoute = loadModuleClear(cb, 'rfp.enrollment');
      renderRoute(RFPSection);
    },
    childRoutes: [],
  };
  const RFPRates = {
    path: 'rates',
    name: 'rfpRates',
    onEnter: (nextState, replace) => {
      const currentProducts = store.getState().get('clients').get('current').get('products').toJS();
      const currentSection = nextState.routes[5].path;
      if (currentProducts[currentSection] === false && nextState.routes[5].path === currentSection) {
        const filteredSections = Object.keys(currentProducts).filter((key) => currentProducts[key] ? key : false);
        redirect(nextState, replace, `rates/${filteredSections[0]}`);
      }
      checkClientRoute(nextState, replace, store, 'rfp', setRouteError, selectDirectToPresentation);
    },
    indexRoute: {
      onEnter: (nextState, replace) => {
        const currentProducts = store.getState().get('clients').get('current').get('products').toJS();
        if (currentProducts.medical) {
          redirect(nextState, replace, 'rates/medical');
        } else {
          redirect(nextState, replace, 'rates/dental');
        }
      },
    },
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
      const importModules = Promise.all([
        import('pages/Rfp/Team'),
      ]);

      injectReducer('team', TeamReducer);
      injectSagas(TeamSagas, 'team');

      const renderRoute = loadModule(cb, 'rfp.team');
      importModules.then(([component]) => {
        renderRoute(component);
      });

      importModules.catch(errorLoading);
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

      renderRoute(PreviewWrap);
    },
  };
  const RFPStart = {
    path: 'start',
    name: 'startRfp',
    // onEnter: requireAuth,
    getComponent(nextState, cb) {
      const importModules = Promise.all([
        import('pages/Rfp/Start'),
      ]);

      const renderRoute = loadModule(cb, 'rfp.start');
      importModules.then(([component]) => {
        renderRoute(component);
      });

      importModules.catch(errorLoading);
    },
  };
  const routes = {
    path: 'rfp',
    onEnter: (nextState, replace) => checkClientRoute(nextState, replace, store, 'rfp', setRouteError, selectDirectToPresentation),
    indexRoute: { onEnter: (nextState, replace) => redirect(nextState, replace, 'client') },
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
        indexRoute: { onEnter: (nextState, replace) => redirect(nextState, replace, `client/${rfpClientRedirect}`) },
        getComponent(nextState, cb) {
          const renderRoute = loadModuleClear(cb, 'rfp.client');
          renderRoute(RFPSection);
        },
        childRoutes: RFPClient,
      },
    ],
  };

  const addChild = (route, comp, key, section) => {
    route.childRoutes.push({
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
    });
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
  routes.childRoutes.push(RFPTeams);
  routes.childRoutes.push(RFPCarriers);
  routes.childRoutes.push(RFPPreview);
  routes.childRoutes.push(RFPStart);

  return routes;
};

export default createRoutes;
