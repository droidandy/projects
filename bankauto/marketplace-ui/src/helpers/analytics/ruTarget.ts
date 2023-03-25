const dataLayer = '_rutarget';

type RuTargetAnalyticsEvent = {
  event: string;
  conv_id?: string;
};

export const pushToDataLayerRuTarget = (analyticsEvent: RuTargetAnalyticsEvent) => {
  if (typeof window === 'object') {
    // @ts-ignore
    if (!window[dataLayer]) {
      // @ts-ignore
      window[dataLayer] = [];
    }
    // @ts-ignore
    window[dataLayer].push(analyticsEvent);
  }
};

export const initRuTargetAnalytics = () => {
  pushToDataLayerRuTarget({ event: 'otherPage' });
};
