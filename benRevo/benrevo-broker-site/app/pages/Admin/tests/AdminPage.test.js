import React from 'react';
import { configure, mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from './../../../store';
import AdminPage from '../';
import SendToListHistory from './../SendToListHistory';

configure({ adapter: new Adapter() });

describe('<AdminPage />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  it('should render the Admin component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <AdminPage params={{}} />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find(SendToListHistory).length).toBe(1);
  });
});
