import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../../../store';
import HeaderAccess from './../../HeaderAccess';

configure({ adapter: new Adapter() });

describe('<HeaderAccess />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const client = {
    clientId: 1,
    clientName: 'Name',
  };

  it('HeaderAccess should render itself', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <HeaderAccess client={client} />
      </Provider>
    );
    expect(renderedComponent.find('.app-header.access').length).toBe(1);
  });
});
