
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { MedicalPlans } from '@benrevo/benrevo-react-core';
import { initialPresentationMasterState } from './../../reducer/state';
import Motion from './../components/Motion';

configure({ adapter: new Adapter() });

describe('<Motion />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });
  const item = {
    valueIn: '100',
    valueOut: '200',
    name: 'Ambulance',
    typeIn: 'STRING',
    typeOut: 'STRING',
    sysName: 'INDIVIDUAL_DEDUCTIBLE',
    originalValueIn: '100',
    discountValueIn: '80',
    originalValueOut: '200',
    discountValueOut: '160',
    originalValue: '150',
    discountValue: '140',
  };
  window.requestAnimationFrame = jest.fn();
  window.cancelAnimationFrame = jest.fn();
  it('should render the Motion', () => {
    const currentPlan = MedicalPlans.plans[0];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Motion
            data={item}
            benefits={currentPlan.benefits}
            carrierName={'Anthem'}
            motionLink={'link'}
            value
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('a').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.motion-value').length).toBe(1);
  });
});
