import { nav } from 'type';
import { isMobile } from 'helper/common';

const initialState = {
  open: '',
  sidebar: isMobile.any() ? nav.sideBar.profile : nav.sideBar.details,
  user: 'full',
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case nav.DRAWER_SHOW: {
      return { ...state, open: payload };
    }
    case nav.DRAWER_HIDE: {
      return { ...state, open: '' };
    }
    case nav.SIDEBAR_SHOW: {
      return { ...state, sidebar: payload };
    }
    default: {
      return state;
    }
  }
};

