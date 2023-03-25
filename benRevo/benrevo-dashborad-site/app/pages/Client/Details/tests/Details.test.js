import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../../store';
import Details from '../';

configure({ adapter: new Adapter() });

describe('<Details />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the Home component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Details params={{ clientId: '1' }} />
        </IntlProvider>
      </Provider>
    );


    expect(renderedComponent.find('a.back-button').length).toBe(1);
  });
});
