import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import WherePacketsMailedTitle from './../questions/misc/WherePacketsMailedTitle';

configure({ adapter: new Adapter() });

describe('<WherePacketsMailedTitle />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const client = {
    address: 'client address',
    city: 'City',
    state: 'State',
    zip: 'Zip',
  };
  it('should render the WherePacketsMailedTitle page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <WherePacketsMailedTitle client={client} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('div').length).toBe(2);
  });
});
