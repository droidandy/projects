import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import Adapter from 'enzyme-adapter-react-16';
import {
  Networks,
} from '@benrevo/benrevo-react-quote';
import configureStore from '../../../../store';
import NetworksPage from './../sub/NetworksPage';

configure({ adapter: new Adapter() });

describe('<NetworksPage />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  const section = 'medical';

  it('should render itself', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <NetworksPage section={section} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find(Networks).length).toBe(1);
  });
});
