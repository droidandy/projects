import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import ItemValueTyped from './../components/ItemValueTyped';
import { initialPresentationMasterState } from './../../reducer/state';

configure({ adapter: new Adapter() });

describe('<ItemValueTyped />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });

  const benefits = null;

  const dollar = {
    name: 'aaa',
    value: '200',
    valueIn: '',
    valueOut: '',
    type: 'DOLLAR',
  };

  const percent = {
    name: 'aaa',
    value: '0.1',
    valueIn: '',
    valueOut: '',
    type: 'PERCENT',
  };

  it('should render the dollar value', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ItemValueTyped
            benefits={benefits}
            item={dollar}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.text()).toBe('$200.00');
  });

  it('should render the percent value text', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ItemValueTyped
            benefits={benefits}
            item={percent}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.text()).toBe('0.1%');
  });
});
