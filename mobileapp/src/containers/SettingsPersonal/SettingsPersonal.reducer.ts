import { Reducer } from 'react';

import { Sex, UpdateUserDataInputModel } from '../../apollo/requests';

type ClearedUserData = Omit<UpdateUserDataInputModel, 'password' | 'personal_birthday'>;

interface SettingsPersonalState extends ClearedUserData {
  error?: Error;
  networkError?: string;
  initialized?: boolean;
  personal_birthday?: Date;
}

type Action =
  | {
      type: keyof ClearedUserData | 'SetNetworkError';
      payload: string;
    }
  | {
      type: 'personal_gender';
      payload: Sex;
    }
  | {
      type: 'personal_birthday';
      payload?: Date;
    }
  | {
      type: 'SetError';
      payload: Error;
    }
  | {
      type: 'Init';
      payload: SettingsPersonalState;
    };

export const initialState: SettingsPersonalState = {
  email: '',
  login: '',
  last_name: '',
  name: '',
  personal_birthday: undefined,
  personal_gender: undefined,
  personal_phone: '',
  personal_photo_del: false,
  second_name: '',
  initialized: false,
};

export const reducer: Reducer<SettingsPersonalState, Action> = (
  state,
  action,
): SettingsPersonalState => {
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
        [action.type]: action.payload,
      };
    }
  }
};
