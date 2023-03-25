import {
  Wrapper,
} from '@benrevo/benrevo-react-onboarding';
import Questions from '../pages/OnBoarding/questions';

const createRoutes = (requireAuth, errorLoading, loadModule, loadModuleClear) => {
  const onBoardingRoutes = [];

  Object.keys(Questions).map((page) => {
    const children = [];

    Object.keys(Questions[page]).map((section) => {
      const elemChild = {
        path: section,
        onEnter: requireAuth,
        getComponent(nextState, cb) {
          const importModules = Promise.all([
            import('pages/OnBoarding/Section'),
          ]);

          const renderRoute = loadModule(cb, `onBoarding.${page}.${section}`);
          importModules.then(([component]) => {
            renderRoute(component);
          });

          importModules.catch(errorLoading);
        },
      };

      children.push(elemChild);
      return true;
    });

    const elem = {
      path: page,
      name: `onBoarding-${page}`,
      onEnter: requireAuth,
      indexRoute: { onEnter: (nextState, replace) => replace(`/onboarding/${page}/section1`) },
      getComponent(nextState, cb) {
        const renderRoute = loadModuleClear(cb, `onBoarding.${page}`);
        renderRoute(Wrapper);
      },
      childRoutes: children,
    };

    onBoardingRoutes.push(elem);
    return true;
  });

  return onBoardingRoutes;
};

export default createRoutes;
