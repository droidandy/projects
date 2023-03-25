import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import Setup from '../index';

configure({ adapter: new Adapter() });

describe('<Setup  />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const params = {
    clientId: '1',
  };
  it('should render the empty clients table', () => {
    const renderedComponent = mount(<Provider store={store}><Setup params={params} /></Provider>);
    expect(renderedComponent.find(Setup).length).toBe(1);
  });
  it('should render the empty clients table', () => {
    const renderedComponent = mount(<Provider store={store}><Setup params={params} /></Provider>);
    expect(renderedComponent.find('.setup-page').length).toBe(2);
  });
});
