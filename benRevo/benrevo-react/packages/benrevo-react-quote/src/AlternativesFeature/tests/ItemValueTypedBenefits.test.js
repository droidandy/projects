import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import ItemValueTypedBenefits from './../components/ItemValueTypedBenefits';
import { initialPresentationMasterState } from './../../reducer/state';

configure({ adapter: new Adapter() });

describe('<ItemValueTypedBenefits />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });

  const dollar = {
    name: 'aaa',
    value: '200',
    valueIn: '140',
    valueOut: '7.8',
    type: 'DOLLAR',
  };

  const percent = {
    name: 'aaa',
    value: '0.1',
    valueIn: '130',
    valueOut: '5.7',
    type: 'PERCENT',
  };

  it('should render the value text', () => {
    const benefits = 'in';
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ItemValueTypedBenefits
            item={dollar}
            benefits={benefits}
            carrierName={'Anthem'}
            motionLink={'Link'}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.text()).toBe('140');
  });

  it('should render the value text', () => {
    const benefits = 'out';
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ItemValueTypedBenefits
            item={percent}
            benefits={benefits}
            carrierName={'Anthem'}
            motionLink={'Link'}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.text()).toBe('5.7');
  });

  it('should render the dollar value', () => {
    const benefits = null;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ItemValueTypedBenefits
            item={dollar}
            benefits={benefits}
            carrierName={'Anthem'}
            motionLink={'Link'}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.text()).toBe('$200.00');
  });
});
