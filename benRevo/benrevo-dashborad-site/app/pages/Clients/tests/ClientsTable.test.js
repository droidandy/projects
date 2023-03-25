import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../store';
import ClientsTable from '../components/ClientsTable';

configure({ adapter: new Adapter() });

describe('<ClientsTable />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const role = 'admin';
  const clients = [];
  const sort = {};
  const filters = {};
  it('should render the ClientsTable component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ClientsTable
            role={role}
            clients={clients}
            sort={sort}
            changeClientsSort={jest.fn()}
            setFilter={jest.fn()}
            filters={filters}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.clients-table-wrap').length).toBe(2);
  });
});
