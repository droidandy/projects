import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { initialPresentationMasterState } from './../../reducer/state';
import Enrollment from '../.';

configure({ adapter: new Adapter() });

describe('<Enrollment />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
      clients: { current: { virginCoverage: {} } },
    });
    store = mockStore(initialState);
  });

  it('should render presentation-enrollment', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <Enrollment />
      </Provider>
    );
    expect(renderedComponent.find('.presentation-enrollment').length).toBe(1);
  });
});
