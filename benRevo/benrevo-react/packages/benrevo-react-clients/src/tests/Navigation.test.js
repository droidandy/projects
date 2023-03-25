import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import Navigation from '../components/Navigation';

configure({ adapter: new Adapter() });

describe('<Navigation  />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  beforeAll(() => {
    const initialState = fromJS({});
    store = mockStore(initialState);
  });
  it('should render the Navigation', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
    expect(renderedComponent.find('.responsive-nav').length).toBe(1);
  });
});
