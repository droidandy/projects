import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Guard } from 'types/Guard';
import { StateModel } from 'store/types';

const useRouteGuards = (...guards: Guard[]): boolean => {
  const user = useSelector(({ user }: StateModel) => user);
  const [pagePass, setPagePass] = useState(false);

  const userIsNotAuthorized = (): boolean => {
    return !user.authorizationError && !user.id && !user.isAuthorized;
  };

  useEffect(() => {
    if (userIsNotAuthorized()) {
      return;
    }

    Promise.all(guards.map((guard) => guard()))
      .then(() => {
        setPagePass(true);
      })
      .catch((error) => {
        console.error(error);
        setPagePass(false);
      });
  }, [user]);

  return pagePass;
};

export { useRouteGuards };
