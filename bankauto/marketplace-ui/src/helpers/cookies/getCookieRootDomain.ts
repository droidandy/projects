export const getCookieRootDomain = () =>
  (window.location.host.includes('localhost') && '.localhost') ||
  (window.location.host.includes('marketplace.dev.bankauto.lo') && 'marketplace.dev.bankauto.lo') ||
  (window.location.host.includes('bankauto') && 'bankauto.ru') ||
  undefined;
