import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import Adapter from 'enzyme-adapter-react-16';
import {
  Overview,
} from '@benrevo/benrevo-react-quote';
import configureStore from '../../../../store';
import OverviewPage from './../sub/OverviewPage';

configure({ adapter: new Adapter() });

describe('<OverviewPage />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  const carrier = {
    carrier: {
      carrierId: 1,
    },
  };
  const section = 'medical';

  it('should render itself', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <OverviewPage section={section} carrier={carrier} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find(Overview).length).toBe(1);
  });
});
