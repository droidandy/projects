import { pushToDataLayerHybrid } from '../hybridAnalytics';

export const analyticsBrandOnChange = () => {
  pushToDataLayerHybrid(['track', 'type_of_car']);
};
