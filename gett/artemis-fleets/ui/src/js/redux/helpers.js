import { mapKeys, mapValues, pick } from 'lodash';

const allDispatchers = {};

function actions(namespace) {
  return function(action, ...args) {
    return { type: `${namespace}/${action}`, args };
  };
}

function dispatcher(namespace) {
  return function(name, handler) {
    allDispatchers[namespace][name] = handler;
  };
}

export function reduce(namespace, initialState, setup) {
  const reducers = {};

  setup(function(name, reducer) {
    reducers[name] = reducer;
  });

  const namespacedMapping = mapKeys(reducers, (_, key) => `${namespace}/${key}`);

  return function(state = initialState, action) {
    const handler = namespacedMapping[action.type];

    if (!handler) {
      return state;
    }

    return handler(state, ...action.args);
  };
}

export function namespace(ns, setup) {
  if (allDispatchers[ns] === undefined) {
    allDispatchers[ns] = {};
  }

  setup(dispatcher(ns), actions(ns));

  function dispatchers(dispatch, picked) {
    let namespaceDispatchers = allDispatchers[ns];

    if (picked !== undefined) {
      namespaceDispatchers = pick(namespaceDispatchers, picked);
    }

    return mapValues(namespaceDispatchers, dispatcher =>
      function() { return dispatcher(dispatch, ...arguments); }
    );
  }

  dispatchers.mapToProps = function(dispatch) {
    return dispatchers(dispatch);
  };

  return dispatchers;
}
