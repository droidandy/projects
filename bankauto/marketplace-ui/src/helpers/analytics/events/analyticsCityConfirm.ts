import { pushToDataLayerHybrid } from '../hybridAnalytics';

export const analyticsCityConfirm = () => {
  pushToDataLayerHybrid(['track', 'GEO']);
};
