import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../../../store';
import HeaderIndex from './../../';

configure({ adapter: new Adapter() });

describe('<HeaderIndex />', () => {
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
        <HeaderIndex client={client} />
      </Provider>
    );
    expect(renderedComponent.find('.app-header').length).toBe(1);
  });
});
