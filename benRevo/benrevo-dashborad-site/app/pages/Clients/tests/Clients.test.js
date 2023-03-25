import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../store';
import Clients from '../';

configure({ adapter: new Adapter() });

describe('<Home />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the Home component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Clients />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.card-main').length).toBe(2);
  });
});
