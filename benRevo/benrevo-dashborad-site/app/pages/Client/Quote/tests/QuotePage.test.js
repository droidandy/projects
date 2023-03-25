import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import Adapter from 'enzyme-adapter-react-16';
import {
  Quote,
} from '@benrevo/benrevo-react-quote';
import configureStore from '../../../../store';
import QuotePage from './../QuotePage';


configure({ adapter: new Adapter() });

describe('<QuotePage />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const params = {
    clientId: 1,
  };

  it('should render itself', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <QuotePage params={params} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find(Quote).length).toBe(1);
  });
});
