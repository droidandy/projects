export interface AnalyticsEvent {
  // event: string;
  // form_name: string;
  form_step: string | number;
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
      ...analyticsEvent,
      screenName: pathname,
      pageTitle: title,
      event: 'form_step_success',
      form_name: 'zayavka_remont',
      timeStamp: Math.ceil(Date.now() / 1000),
    });
  }
};
