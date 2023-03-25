import { pushToDataLayerHybrid } from '../hybridAnalytics';

export const analyticsFilterConfirm = () => {
  pushToDataLayerHybrid(['track', 'confirm']);
};
