import router from 'next/router';

import { getStore } from 'store';

function unVerifiedPhoneGuard(): Promise<void> {
  const {
    user: { isPhoneVerified, isAuthorized },
  } = getStore().getState();

  return new Promise((resolve, reject) => {
    if (isAuthorized && !isPhoneVerified) {
      router.push('/profile/[type]', '/profile/applications');
      reject();
    } else {
      resolve();
    }
  });
}

export { unVerifiedPhoneGuard };
