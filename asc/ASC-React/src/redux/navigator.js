const TYPE = {
  SET_NAV_MAP: 'SET_NAV_MAP',
  NAV_SWIPEABLE_PANEL: 'NAV_SWIPEABLE_PANEL',
  PUSH_PAGE: 'PUSH_PAGE',
  PUSH_MODAL: 'PUSH_MODAL',
  PUSH_PREVIOUS: 'PUSH_PREVIOUS',
  CHANGE_TOOLBARTYPE: 'CHANGE_TOOLBARTYPE',
  HISTORY_STATE: 'HISTORY_STATE'
};

export let pushPage = (showPage, namePage) => ({
  type: TYPE.PUSH_PAGE,
  showPage,
  namePage
});

export let pushModal = (nameModal) => ({
  type: TYPE.PUSH_MODAL,
  nameModal
});

export let changeToolbarType = (toolbarType) => ({
  type: TYPE.CHANGE_TOOLBARTYPE,
  toolbarType
});

export let pushPrevious = (previousShowPage, previousNamePage, previousToolbarType) => ({
  type: TYPE.PUSH_PREVIOUS,
  previousShowPage,
  previousNamePage,
  previousToolbarType
});

export let setHistoryState = (state) => ({
  type: TYPE.HISTORY_STATE,
  state
});

export let setNavMap = (openMap) => ({
  type: TYPE.SET_NAV_MAP,
  openMap
});

export let setNavSwipeablePanel = (isSwipeable) => ({
  type: TYPE.NAV_SWIPEABLE_PANEL,
  isSwipeable
});

let initialState = {
  showPage: false,
  openMap: false,
  isSwipeable: true,
  namePage: 'HOME',
  nameModal: '',
  toolbarType: 'main',
  previousShowPage: null,
  previousNamePage: null,
  previousToolbarType: 'main'
};

let hash = window.location.hash; // eg #Register?google-2016-12-0101`
let pos = window.location.hash.indexOf('#Register?');
if (pos !== -1) {
  window.localStorage.setItem('regInfo', hash.slice(10));
  initialState.namePage = 'Register';
}

window.history.replaceState(initialState, initialState.namePage, '#' + initialState.namePage);

export default (_state = initialState, action = {}) => {
  let state = {..._state};
  switch (action.type) {
    case TYPE.HISTORY_STATE:
      return action.state;
    case TYPE.PUSH_PAGE:
      if (action.namePage.toString() !== state.namePage.toString()) {
        window.history.pushState({
          ...state,
          previousShowPage: state.showPage,
          previousNamePage: state.namePage,
          showPage: action.showPage,
          namePage: action.namePage
        }, action.namePage, '#' + action.namePage);
      }
      return {
        ...state,
        previousShowPage: state.showPage,
        previousNamePage: state.namePage,
        showPage: action.showPage,
        namePage: action.namePage
      };
    case TYPE.PUSH_MODAL:
      return {
        ...state,
        nameModal: action.nameModal
      };
    case TYPE.CHANGE_TOOLBARTYPE:
      window.history.replaceState({
        ...state,
        previousToolbarType: state.toolbarType,
        toolbarType: action.toolbarType
      }, state.namePage, '#' + state.namePage);
      return {
        ...state,
        previousToolbarType: state.toolbarType,
        toolbarType: action.toolbarType
      };
    case TYPE.PUSH_PREVIOUS:
      return {
        ...state,
        previousShowPage: action.previousShowPage,
        previousNamePage: action.previousNamePage,
        previousToolbarType: action.previousToolbarType
      };
    case TYPE.SET_NAV_MAP:
      window.history.replaceState({
        ...state,
        openMap: action.openMap
      }, state.namePage, '#' + state.namePage);
      return {
        ...state,
        openMap: action.openMap
      };
    case TYPE.NAV_SWIPEABLE_PANEL:
      window.history.replaceState({
        ...state,
        isSwipeable: action.isSwipeable
      }, state.namePage, '#' + state.namePage);
      return {
        ...state,
        isSwipeable: action.isSwipeable
      };
    default:
      return state;
  }
};
