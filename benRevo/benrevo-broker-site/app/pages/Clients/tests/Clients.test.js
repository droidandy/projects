import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import Clients from '../index';

configure({ adapter: new Adapter() });

describe('<Clients  />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the empty clients table', () => {
    const renderedComponent = mount(<Provider store={store}><Clients /></Provider>);
    expect(renderedComponent.find('table.main-table').length).toBe(1);
  });
});
