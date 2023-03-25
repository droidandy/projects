import { fromJS, Map } from 'immutable';
import { RfpReducerState } from '@benrevo/benrevo-react-rfp';
import RXHMO from '../Plans/RXHMO';
import HMO from '../Plans/HMO';
import DHMO from '../Plans/DHMO';
import VISION from '../Plans/Vision';


export const additionalState = fromJS({
  loading: false,
  plansLoaded: false,
  medical: Map({
    benefits: fromJS([{ ...HMO, rx: [...RXHMO.benefits] }]),
  }),
  dental: Map({
    benefits: fromJS([{ ...DHMO }]),
  }),
  vision: Map({
    benefits: fromJS([{ ...VISION }]),
  }),
});

export default RfpReducerState.mergeDeep(additionalState);

