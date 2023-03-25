import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import TeamMembers from '../';
import { changeForm } from '../actions';
import { initialState as teamReducerState } from '../reducer';

configure({ adapter: new Adapter() });

describe('<TeamMembers />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const clientMockState = { current: { clientName: '' } };
    const initialState = fromJS({
      team: teamReducerState,
      clients: clientMockState,
    });
    store = mockStore(initialState);
  });

  it('should render the TeamMembers component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <TeamMembers />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.responsive-nav').length).toBe(1);
  });
});
