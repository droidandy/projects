/**
 * The global state selectors
 */
import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('app');

const makeSelectLoading = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('loading')
);

const makeSelectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    const routingState = state.get('route'); // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

const makeSelectForm = () => createSelector(
  selectGlobal,
  (homeState) => homeState.get('requestDemoForm').toJS()
);

export {
  selectGlobal,
  makeSelectForm,
  makeSelectLoading,
  makeSelectLocationState,
};
