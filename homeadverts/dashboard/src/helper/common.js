import { Fragment } from 'react';

export const isMobile = {
  Android: () => navigator.userAgent.match(/Android/i),
  BlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
  iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
  Opera: () => navigator.userAgent.match(/Opera Mini/i),
  Windows: () => navigator.userAgent.match(/IEMobile/i),
  any: () => isMobile.Android()
    || isMobile.BlackBerry()
    || isMobile.iOS()
    || isMobile.Opera()
    || isMobile.Windows(),
};

export const status = {
  active: 'active',
  inactive: 'inactive',
  invisible: 'invisible',
};

export const contentType = {
  article: 'article',
  property: 'property',
  user: 'user',
};

export const roomDefault = { Component: Fragment, properties: {} };
