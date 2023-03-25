import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import Adapter from 'enzyme-adapter-react-16';
import { Final } from '@benrevo/benrevo-react-quote';
import configureStore from '../../../../store';
import FinalPage from './../FinalPage';

configure({ adapter: new Adapter() });

describe('<FinalPage />', () => {
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
          <FinalPage params={params} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find(Final).length).toBe(1);
  });
});
