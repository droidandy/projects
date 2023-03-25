import { pushAnalyticsEvent, pushCriteoAnalyticsEvent, AnalyticsEvent } from './analytics';

const shouldSuppressPageView = (url: string) => {
  const lastPageView = (window as any).dataLayer
    ?.filter(({ event }: AnalyticsEvent) => {
      return event === 'pageView';
    })
    ?.pop();

  const lastPageViewPathName = lastPageView?.screenName.split('?')[0];
  const urlPathName = url.split('?')[0];

  return (
    lastPageView?.screenName === window.location.pathname ||
    (lastPageViewPathName === '/' && urlPathName === '/') ||
    (lastPageViewPathName === '/' && urlPathName === '/car/new/') ||
    (lastPageViewPathName === '/car/new' && urlPathName === '/') ||
    (lastPageViewPathName === '/car/new/' && urlPathName === '/car/new/') ||
    (lastPageViewPathName === '/car/used/' && urlPathName === '/car/used/')
  );
};

export const GTMPageViewWithId = (url: string, userUuid = '') => {
  // @ts-ignore
  if (typeof window === 'object') {
    if (shouldSuppressPageView(url)) {
      return;
    }

    const pageEvent = {
      event: 'pageView',
      user_id: userUuid ?? null,
      userAuth: userUuid ? 1 : 0,
      screenName: url,
    };

    pushAnalyticsEvent(pageEvent);
  }
};

export const GTMPageView = (url: string) => {
  // @ts-ignore
  if (typeof window === 'object') {
    const pageEvent = {
      event: 'firstPageView',
      user_id: null,
      userAuth: 0,
      screenName: url,
    };

    pushAnalyticsEvent(pageEvent);
  }
};

export const rtrgOtherPageView = (url: string) => {
  if (typeof window === 'object') {
    if (shouldSuppressPageView(url)) {
      return;
    }

    if (!/^\/(car\/.*|offer|profile\/applications\/.*)\//.test(url) || /^\/car\/(new|used)\/$/.test(url)) {
      pushCriteoAnalyticsEvent({ rtrgAction: 'view_other' });
    }
  }
};
