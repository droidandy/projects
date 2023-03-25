const createRoutes = (requireAuth, errorLoading, loadModule, loadModuleClear, store) => {
  const rfpClientRedirect = 'info';
  const products = store.getState().get('clients').get('products');
  const RFPClient = [
    {
      path: 'info',
      onEnter: requireAuth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Prequote/Info'),
        ]);
        const renderRoute = loadModule(cb, 'prequote.clients.client.info');
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
          import('pages/Prequote/Products'),
        ]);

        const renderRoute = loadModule(cb, 'prequote.clients.client.products');
        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
  ];
  const summary = {
    path: 'summary',
    onEnter: requireAuth,
    getComponent(nextState, cb) {
      const importModules = Promise.all([
        import('pages/Prequote/Summary'),
      ]);
      const renderRoute = loadModule(cb, 'prequote.clients.summary');
      importModules.then(([component]) => {
        renderRoute(component);
      });

      importModules.catch(errorLoading);
    },
  };
  const rater = {
    path: 'rater',
    onEnter: requireAuth,
    getComponent(nextState, cb) {
      const importModules = Promise.all([
        import('pages/Prequote/Rater'),
      ]);
      const renderRoute = loadModule(cb, 'prequote.clients.rater');
      importModules.then(([component]) => {
        renderRoute(component);
      });

      importModules.catch(errorLoading);
    },
  };
  const quote = {
    path: 'quote',
    onEnter: requireAuth,
    getComponent(nextState, cb) {
      const importModules = Promise.all([
        import('pages/Prequote/Quote'),
      ]);
      const renderRoute = loadModule(cb, 'prequote.clients.quote');
      importModules.then(([component]) => {
        renderRoute(component);
      });
      importModules.catch(errorLoading);
    },
  };
  const routes = [
    {
      path: 'client',
      name: 'rfpClient',
      onEnter: requireAuth,
      indexRoute: { onEnter: (nextState, replace) => replace(`${nextState.location.pathname}/${rfpClientRedirect}`) },
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('pages/Prequote/Section'),
        ]);
        const renderRoute = loadModule(cb, 'prequote.clients.section');
        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
      childRoutes: RFPClient,
    },
  ];
  const send = {
    path: 'send',
    onEnter: requireAuth,
    getComponent(nextState, cb) {
      const importModules = Promise.all([
        import('pages/Prequote/Send'),
      ]);
      const renderRoute = loadModule(cb, 'prequote.clients.send');
      importModules.then(([component]) => {
        renderRoute(component);
      });

      importModules.catch(errorLoading);
    },
  };
  const addChild = (comp, key, section) => (
    {
      path: key,
      getComponent(nextState, cb) {
        const importModules = Promise.all(comp);

        const renderRoute = loadModule(cb, `prequote.clients.${section}.${key}`);
        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }
  );
  const addSection = (comp, key) => (
    {
      path: key,
      indexRoute: { onEnter: (nextState, replace) => replace(`${nextState.location.pathname}/info`) },
      getComponent(nextState, cb) {
        const importModules = Promise.all(comp);

        const renderRoute = loadModule(cb, `prequote.clients.${key}`);
        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
      childRoutes: [],
    }
  );
  const match = addSection([import('pages/Prequote/Section')], 'match');
  const rate = addSection([import('pages/Prequote/Section')], 'rate');

  products.keySeq().forEach((key) => {
    if (key !== 'medical' && key !== 'dental' && key !== 'vision') return true;

    const mainSection = addSection([import('pages/Prequote/Section')], key);

    mainSection.childRoutes.push(addChild([import('pages/Prequote/ProductInfo')], 'info', key));
    mainSection.childRoutes.push(addChild([import('pages/Prequote/ProductContribution')], 'contribution', key));
    mainSection.childRoutes.push(addChild([import('pages/Prequote/ProductRates')], 'rates', key));
    mainSection.childRoutes.push(addChild([import('pages/Prequote/ProductEnrollment')], 'enrollment', key));
    if (key === 'medical') mainSection.childRoutes.push(addChild([import('pages/Prequote/ProductUW')], 'uw', key));
    if (key !== 'vision') mainSection.childRoutes.push(addChild([import('pages/Prequote/ProductBenefits')], 'benefits', key));

    routes.push(mainSection);

    match.childRoutes.push(addChild([import('pages/Prequote/MatchProduct')], key, 'match'));

    if (key === 'medical') {
      match.childRoutes.push(addChild([import('pages/Prequote/MatchProduct')], 'kaiser', 'match'));
      rate.childRoutes.push(addChild([import('pages/Prequote/RateProduct')], key, 'rate'));
      rate.childRoutes.push(addChild([import('pages/Prequote/RateProduct')], 'kaiser', 'rate'));
    }

    return true;
  });

  routes.push(summary);
  routes.push(rater);
  routes.push(quote);
  routes.push(match);
  routes.push(rate);
  routes.push(send);

  return routes;
};

export default createRoutes;
