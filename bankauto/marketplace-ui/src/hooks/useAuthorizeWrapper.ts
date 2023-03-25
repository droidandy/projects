import { useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StateModel } from 'store/types';
import { changeAuthModalVisibility } from 'store/user';
import { RegistrationTypes } from 'types/Authentication';
import { getCookieImpersonalization } from 'helpers/authCookies';

type Callback = () => void;

export interface AuthorizeProps {
  callback: Callback;
  regType: RegistrationTypes;
  authModalTitle?: string;
  authModalText?: string;
}

export const useAuthorizeWrapper = () => {
  const action = useRef<Callback | undefined>(undefined);
  const isAuthorized = useSelector(
    ({ user: { isAuthorized, firstName } }: StateModel) => isAuthorized && (firstName || getCookieImpersonalization()),
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthorized && action.current) {
      action.current();
      action.current = undefined;
    }
  }, [isAuthorized]);

  return useCallback(
    ({ callback, ...rest }: AuthorizeProps) => {
      if (isAuthorized) {
        callback();
        return;
      }
      dispatch(changeAuthModalVisibility(true, { ...rest }));
      action.current = callback;
    },
    [isAuthorized],
  );
};
