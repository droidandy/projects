import { Reducer } from 'react';
import { NotificationModel } from '../../apollo/requests';

type ClearedUserData = Omit<NotificationModel, '__typename'>;

interface State extends ClearedUserData {
  initialized?: boolean;
  error?: Error;
  networkError?: string;
}

type Action =
  | {
      type: 'SetNetworkError';
      payload: string;
    }
  | {
      type: 'SetError';
      payload: Error;
    }
  | {
      type: 'Init';
      payload: State;
    }
  | {
      type: keyof ClearedUserData;
      payload: boolean;
    };

export const initialState: State = {
  status: false,
  stocks: false,
  initialized: false,
};

export const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'SetError': {
      return {
        ...state,
        error: action.payload,
      };
    }
    case 'SetNetworkError': {
      return {
        ...state,
        networkError: action.payload,
      };
    }
    case 'Init': {
      return {
        ...state,
        ...action.payload,
        initialized: true,
      };
    }
    default: {
      return {
        ...state,
        error: undefined,
        networkError: undefined,
        [action.type as string]: action.payload,
      };
    }
  }
};
