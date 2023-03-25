
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { initialPresentationMasterState } from './../../reducer/state';
import Counter from './../components/Counter';

configure({ adapter: new Adapter() });

describe('<Counter />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });
  it('should render the Counter', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Counter total={100} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('span').text()).toBe('Showing 0 - 0 of 100 PLANS');
  });

  it('should render the Counter', () => {
    let elem = null;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Counter total={50} ref={(node) => { elem = node; }} />
        </IntlProvider>
      </Provider>
    );
    elem.updateCount('next');
    elem.setCount(5);
    expect(renderedComponent.find('span').text()).toBe('Showing 6 - 10 of 50 PLANS');
  });
});
