import { nav } from 'type';

export const drawerShowAction = payload => ({ type: nav.DRAWER_SHOW, payload });

export const drawerHideAction = payload => ({ type: nav.DRAWER_HIDE, payload });

export const sidebarShowAction = payload => ({ type: nav.SIDEBAR_SHOW, payload });
