import { getCookieImpersonalization } from 'helpers/authCookies';
import router from 'next/router';

import { getStore } from 'store';

function authorizedGuard(): Promise<void> {
  const { user } = getStore().getState();
  const b = router.query.b as string;

  return new Promise((resolve, reject) => {
    if (user.isAuthorized && (user.firstName || getCookieImpersonalization())) {
      if (b) {
        router.push(`/${b}/`);
      }
      reject();
    } else {
      resolve();
    }
  });
}

export { authorizedGuard };
