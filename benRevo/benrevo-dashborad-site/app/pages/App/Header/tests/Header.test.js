import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../../store';
import Header from './../Header';

configure({ adapter: new Adapter() });

describe('<Header />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render itself', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <Header />
      </Provider>
    );
    expect(renderedComponent.find('.app-header').length).toBe(1);
  });
});
