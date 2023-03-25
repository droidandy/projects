// @flow

// as an example for the future
export type State = {
  dropdownOpen: boolean,
  dropdownValue: "All" | "RFQs" | "Items"
};

export type Action = { type: "SHOW_ALL" | "SHOW_RFQS" | "SHOW_ITEMS" | "TOGGLE" };

const initialState = {
  dropdownOpen: false,
  dropdownValue: 'All',
};

// reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'SHOW_ALL':
      return {
        ...state,
        dropdownValue: 'All',
      };

    case 'SHOW_RFQS':
      return {
        ...state,
        dropdownValue: 'RFQs',
      };

    case 'SHOW_ITEMS':
      return {
        ...state,
        dropdownValue: 'Items',
      };

    case 'TOGGLE':
      return {
        ...state,
        dropdownOpen: !state.dropdownOpen,
      };

    default:
      return state;
  }
};

// action creators
export const showAll = (): Action => ({ type: 'SHOW_ALL' });
export const showRFQs = (): Action => ({ type: 'SHOW_RFQS' });
export const showItems = (): Action => ({ type: 'SHOW_ITEMS' });
export const toggle = (): Action => ({ type: 'TOGGLE' });
