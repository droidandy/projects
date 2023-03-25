const dataLayer = '_txq';

export const pushToDataLayerHybrid = (items: string[]) => {
  if (typeof window === 'object') {
    // @ts-ignore
    if (!window[dataLayer]) {
      // @ts-ignore
      window[dataLayer] = [];
    }

    // @ts-ignore
    window[dataLayer].push(items);
  }
};

export const pushHybridAnalytics = () => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = '//st.hybrid.ai/txsp.js';
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
  pushToDataLayerHybrid(['createPixel', '615bf8334d506e4be4ebf289']);
  pushToDataLayerHybrid(['track', 'PageView']);
};

export const initHybridAnalytics = () => {
  pushHybridAnalytics();
};
