import Amplify, { API } from 'aws-amplify';
import Config from 'react-native-config';

import { APItypes } from './types';

import { actions } from '~/store/accountReducer';
import store from '~/store/createStore';
import { AccountProps } from '~/types/account';

export const getToken = async (withSignOut = true): Promise<string | undefined> => {
  try {
    return (await Amplify.Auth.currentSession()).getIdToken().getJwtToken();
  } catch (e) {
    if (withSignOut) {
      Amplify.Auth.signOut();
    }
  }
  return undefined;
};

export async function setAccountId(): Promise<void> {
  const selectedAccountId = store.getState().account.settings.selectedAccount.id;
  if (Number.parseInt(selectedAccountId, 10) >= 0) return;

  try {
    const accounts = (await API.get('allofus', '/accounts', {})) as Array<AccountProps>;
    const cashAccount = accounts.find((acc) => acc.type === 'CASH');
    if (cashAccount) {
      store.dispatch(actions.settings.setSelectedAccount(cashAccount));
      store.dispatch(actions.settings.setAccounts(accounts));
      console.log('Selected account id is', cashAccount.id);
    }
  } catch (err) {
    console.log(err);
  }
}

export const awsconfig = {
  Auth: {
    identityPoolId: Config.IDENTITY_POOL_ID,
    region: Config.REGION,
    userPoolId: Config.USER_POOL_ID,
    userPoolWebClientId: Config.USER_POOL_WEB_CLIENT_ID,
  },
  Analytics: {
    disabled: true,
  },
  API: {
    endpoints: [
      {
        name: APItypes.main,
        endpoint: Config.BASE_SERVER_URL,
        custom_header: async () => ({
          Authorization: `Bearer ${await getToken()}`,
          'aou-account-id': store.getState().account.settings.selectedAccount.id,
        }),
      },
      {
        name: APItypes.guest,
        endpoint: Config.GUEST_SERVER_URL,
      },
    ],
  },
};
