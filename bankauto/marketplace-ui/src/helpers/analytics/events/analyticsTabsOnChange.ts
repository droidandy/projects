import { pushToDataLayerHybrid } from '../hybridAnalytics';

export const analyticsTabsOnChange = (section: string) => {
  pushToDataLayerHybrid(['track', section]);
};
