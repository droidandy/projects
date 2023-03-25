import { User } from '@marketplace/ui-kit/types';
import { AuthenticationState } from 'types/Authentication';

// User Impersonalisation
export interface UserImpersonalisation {
  impersonalizated: boolean;
}

// TODO move User into comined state property
/* prefer
StateSession = {
  session: AuthenticationState & UserImpersonalisation & {
   user: UserState;
  }
}
*/
export type StateUserType = User;

export type UserState = StateUserType & UserImpersonalisation & AuthenticationState;

export type StateSession = {
  user: UserState;
};
