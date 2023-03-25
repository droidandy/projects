
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from '../../../../store';
import clientData from '../../../../mockapi/_v1_clients_1.json';
import ClientTableItem from '../ClientTableItem';

configure({ adapter: new Adapter() });

describe('<ClientTableItem  />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the ClientTableItem', () => {
    const renderedComponent = mount(<Provider store={store}><table><tbody><ClientTableItem item={clientData} /></tbody></table></Provider>);
    expect(renderedComponent.find('span.client-initials').length).toBe(1);
  });
});
