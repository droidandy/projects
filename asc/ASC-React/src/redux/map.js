const TYPE = {
  SET_SHOW_TYPE: 'SET_SHOW_TYPE',
  SET_TYPE_OPTIONS: 'SET_TYPE_OPTIONS'
  // SET_BANNERIMAGE: 'SET_BANNERIMAGE'
};

export let setShowType = (filterType, value) => ({
  type: TYPE.SET_SHOW_TYPE,
  filterType,
  value
});

export let setTypeOptions = (option, value) => ({
  type: TYPE.SET_TYPE_OPTIONS,
  option,
  value
});

const initialState = {
  showPeople: true,
  peopleSportType: 'All',
  peopleSportLevel: 'All',

  showEvents: true,
  eventsSportType: 'All',
  eventsSportLevel: 'All',

  showGroups: true,
  groupsSportType: 'All',
  groupsSportLevel: 'All'
};

export default (_state = initialState, action = {}) => {
  let state = {..._state};
  switch (action.type) {
    case TYPE.SET_SHOW_TYPE:
      return {
        ...state,
        [action.filterType]: action.value
      };
    case TYPE.SET_TYPE_OPTIONS:
      return {
        ...state,
        [action.option]: action.value
      };
    default:
      return state;
  }
};
