import React from 'react';
import { configure, mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from './../../../../store';
import ClientStepCard from '../components/ClientStepCard';

configure({ adapter: new Adapter() });

describe('<ClientStepCard />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const disabled = false;
  const client = {
    clientId: '1',
  };
  const status = {
    client: 'COMPLETED',
  };
  it('should render the ClientStepCard component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <ClientStepCard
            disabled={disabled}
            link={`/clients/${client.id}/setup`}
            header="1. ClientSetup"
            descr="Enter client info and select product to include."
            status={status}
            type="client"
          />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find('.client-step-card').length).toBe(2);
  });
});
