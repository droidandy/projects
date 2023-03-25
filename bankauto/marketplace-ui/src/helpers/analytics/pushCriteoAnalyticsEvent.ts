type CriteoAnalyticsEvent = {
  ecomm_category?: string;
  rtrgAction: string;
  rtrgData?: {
    transaction_id?: string;
    products?: {
      id?: string | number;
      price?: string | number;
    }[];
  };
};

export const pushCriteoAnalyticsEvent = (analyticsEvent: CriteoAnalyticsEvent) => {
  if (typeof window === 'object') {
    // @ts-ignore
    if (!window.dataLayer) {
      // @ts-ignore
      window.dataLayer = [];
    }

    // @ts-ignore
    window.dataLayer.push({
      event: 'rtrgEvent',
      ...analyticsEvent,
    });
  }
};
