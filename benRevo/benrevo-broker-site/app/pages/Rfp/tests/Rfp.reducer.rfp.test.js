import { fromJS } from 'immutable';
import { createRFPPlan } from '@benrevo/benrevo-react-rfp';
import reducer from './../reducer';
import initialState from './../reducer/state';
import * as types from './../constants';
import HMO from './../Plans/HMO';
import RXHMO from './../Plans/RXHMO';

describe('RfpReducerBroker', () => {
  let state;
  const templates = {
    HMO: fromJS({ ...HMO, rx: [...RXHMO.benefits] }),
  };

  beforeAll(() => {
    state = initialState;
  });

  it('initial state', () => {
    const action = { type: undefined };
    expect(reducer(undefined, action)).toEqual(state);
  });

  it('PLANS_GET_SUCCESS - check two plans with rx', () => {
    const clientPlans = [createRFPPlan(null, 'medical', 1, 'HMO').toJS(), createRFPPlan(null, 'medical', 1, 'HMO').toJS()];
    let plans = fromJS([templates.HMO, templates.HMO]);

    plans = plans
      .setIn([0, 'benefits', 0, 'value'], 100)
      .setIn([0, 'benefits', 2, 'value'], 200)
      .setIn([0, 'benefits', 3, 'value'], 300)
      .setIn([0, 'rx', 0, 'value'], 1)
      .setIn([0, 'rx', 1, 'value'], 2)
      .setIn([0, 'rx', 2, 'value'], 3);

    const plansTemplates = plans.toJS();

    plans = plans.deleteIn([0, 'benefits', '7']);
    plans = plans.deleteIn([1, 'benefits', '7']);

    const action = { type: types.PLANS_GET_SUCCESS, payload: { clientPlans, plans: plans.toJS() }, meta: { section: 'medical' } };

    for (let j = 0; j < plansTemplates.length; j += 1) {
      const planTemplate = plansTemplates[j];
      planTemplate.isKaiser = false;
      for (let i = 0; i < planTemplate.benefits.length; i += 1) {
        const benefit = planTemplate.benefits[i];

        if (benefit.type === 'DOLLAR') {
          benefit.value = `$${benefit.value}`;
        } else if (benefit.type === 'PERCENT') {
          benefit.value = `${benefit.value}%`;
        }
      }
    }

    const mockState = state
      .setIn([action.meta.section, 'benefits'], fromJS(plansTemplates));
    const output = reducer(undefined, action);
    expect(output).toEqual(mockState);
  });
});
