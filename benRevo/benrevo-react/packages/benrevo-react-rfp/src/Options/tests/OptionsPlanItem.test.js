import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import OptionsPlanItem from '../components/OptionsPlanItem';
import { RFP_MEDICAL_SECTION, RFP_DENTAL_SECTION, RFP_VISION_SECTION } from './../../constants';

configure({ adapter: new Adapter() });

describe('<OptionsPlanItem />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
    });
    store = mockStore(initialState);
  });

  it('should render the OptionsPlanItem page medical section', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <OptionsPlanItem
          section={RFP_MEDICAL_SECTION}
          item={{ selectedCarrier: {}, selectedNetwork: {} }}
          planList={[]}
          carrierList={[]}
          planNetworks={{}}
          index={0}
          updatePlan={jest.fn()}
          changeCarrier={jest.fn()}
          changeNetwork={jest.fn()}
        />
      </Provider>
    );

    renderedComponent.find('input').forEach((input) => {
      input.simulate('change');
    });

    expect(renderedComponent.find('.optionsPlanItemRow').length).toBe(2);
  });

  it('should render the OptionsPlanItem page dental section', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <OptionsPlanItem
          section={RFP_DENTAL_SECTION}
          item={{ selectedCarrier: {}, selectedNetwork: {} }}
          planList={[]}
          carrierList={[]}
          planNetworks={{}}
          index={0}
          updatePlan={jest.fn()}
          changeCarrier={jest.fn()}
          changeNetwork={jest.fn()}
        />
      </Provider>
    );
    expect(renderedComponent.find('.optionsPlanItemRow').length).toBe(2);
  });

  it('should render the OptionsPlanItem page vision section', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <OptionsPlanItem
          section={RFP_VISION_SECTION}
          item={{ selectedCarrier: {}, selectedNetwork: {} }}
          planList={[]}
          carrierList={[]}
          planNetworks={{}}
          index={0}
          updatePlan={jest.fn()}
          changeCarrier={jest.fn()}
          changeNetwork={jest.fn()}
        />
      </Provider>
    );
    expect(renderedComponent.find('.optionsPlanItemRow').length).toBe(2);
  });
});
