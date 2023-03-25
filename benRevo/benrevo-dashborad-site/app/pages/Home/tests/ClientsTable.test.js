import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../store';
import ClientsTable from './../ClientsTable';

configure({ adapter: new Adapter() });

describe('<ClientsTable />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the ClientsTable page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ClientsTable />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.card-main.clients').length).toBe(2);
  });
});
