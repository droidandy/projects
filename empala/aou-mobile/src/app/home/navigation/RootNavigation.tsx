import * as React from 'react';

import { Routes } from './routes';

export const navigationRef = React.createRef();

export function navigate(name: Routes, params) {
  navigationRef.current?.navigate(name, params);
}

export function getRouteName(): Routes | undefined {
  return navigationRef.current?.getCurrentRoute().name;
}

export function getParams() {
  if (navigationRef.current && navigationRef.current.getCurrentRoute()) {
    return navigationRef.current.getCurrentRoute().params;
  }
  return {};
}
