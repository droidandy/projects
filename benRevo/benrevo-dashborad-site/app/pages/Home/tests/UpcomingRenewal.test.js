import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import { Loader } from 'semantic-ui-react';
import configureStore from '../../../store';
import UpcomingRenewal from './../components/UpcomingRenewal';

configure({ adapter: new Adapter() });

describe('<UpcomingRenewal />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the UpcomingRenewal Card', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <UpcomingRenewal
            productsList={[]}
            clients={[]}
            product={'TEST'}
            getClients={jest.fn()}
            upcomingLoading={false}
            setFilters={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );

    // .hostNodes() makes sure the test only checks DOM, which eliminates duplicates
    expect(renderedComponent.find('.card-main').hostNodes().length).toBe(1);
    expect(renderedComponent.find('.card-sub-title').hostNodes().length).toBe(2);
  });

  it('should render the UpcomingRenewal Card with loader', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <UpcomingRenewal
            productsList={[]}
            clients={[]}
            product={'TEST'}
            getClients={jest.fn()}
            upcomingLoading
            setFilters={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.contains(<Loader active />)).toBe(true);
  });
});
