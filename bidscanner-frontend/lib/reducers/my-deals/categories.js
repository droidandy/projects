// @flow

// declarations
export type State = {
  activeTab: 'all' | 'buy' | 'sell',
};

export type Action = { type: 'SHOW_ALL' | 'SHOW_BUY' | 'SHOW_SELL' };

//
const initialState = {
  activeTab: 'all',
};

// reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'SHOW_ALL':
      return {
        ...state,
        activeTab: 'all',
      };

    case 'SHOW_BUY':
      return {
        ...state,
        activeTab: 'buy',
      };

    case 'SHOW_SELL':
      return {
        ...state,
        activeTab: 'sell',
      };

    default:
      return state;
  }
};

// action creators
export const showAll = (): Action => ({ type: 'SHOW_ALL' });
export const showBuy = (): Action => ({ type: 'SHOW_BUY' });
export const showSell = (): Action => ({ type: 'SHOW_SELL' });
