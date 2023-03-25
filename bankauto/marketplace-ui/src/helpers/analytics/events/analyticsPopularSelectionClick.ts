import { pushToDataLayerHybrid } from '../hybridAnalytics';

export const analyticsPopularSelectionClick = () => {
  pushToDataLayerHybrid(['track', 'popular_cars']);
};
