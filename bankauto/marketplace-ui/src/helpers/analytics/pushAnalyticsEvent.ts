export interface AnalyticsEvent {
  event: string;
  user_id: string | null;
  userAuth: number;
  screenName?: string;
  eventCategory?: string;
  eventAction?: string;
  eventLabel?: string;
}

export const pushAnalyticsEvent = (analyticsEvent: AnalyticsEvent) => {
  if (typeof window === 'object') {
    // @ts-ignore
    if (!window.dataLayer) {
      // @ts-ignore
      window.dataLayer = [];
    }

    const {
      document: { title },
      location: { pathname },
    } = window;

    // @ts-ignore
    window.dataLayer.push({
      screenName: pathname,
      ...analyticsEvent,
      pageTitle: title,
      timeStamp: Math.ceil(Date.now() / 1000),
    });
  }
};
