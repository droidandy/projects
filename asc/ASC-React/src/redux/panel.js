const TYPE = {
  ACTIVE_PANEL: 'ACTIVE_PANEL',
  CLOSE_PANEL: 'CLOSE_PANEL',
  OPEN_PANEL: 'OPEN_PANEL'// ,
  // SWIPEABLE_PANEL: 'SWIPEABLE_PANEL'
};

// export let setSwipeablePanel = (isSwipeable) => ({
//   type: TYPE.SWIPEABLE_PANEL,
//   isSwipeable
// });

export let setOpenPanel = (isOpen) => ({
  type: TYPE.ACTIVE_PANEL,
  isOpen
});

export let openPanel = () => ({
  type: TYPE.OPEN_PANEL
});

export let closePanel = () => ({
  type: TYPE.CLOSE_PANEL
});

const initialState = {
  isOpen: false// ,
  // isSwipeable: true
};

export default (_state = initialState, action = {}) => {
  let state = {..._state};
  switch (action.type) {
    // case TYPE.SWIPEABLE_PANEL:
    //   return {
    //     ...state,
    //     isSwipeable: action.isSwipeable
    //   };
    case TYPE.ACTIVE_PANEL:
      return {
        ...state,
        isOpen: action.isOpen
      };
    case TYPE.OPEN_PANEL:
      return {
        ...state,
        isOpen: true
      };
    case TYPE.CLOSE_PANEL:
      return {
        ...state,
        isOpen: false
      };
    default:
      return state;
  }
};
