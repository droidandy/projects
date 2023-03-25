import { pushToDataLayerHybrid } from '../hybridAnalytics';

export const analyticsBestOffersItemClick = () => {
  pushToDataLayerHybrid(['track', 'best_offer']);
};
