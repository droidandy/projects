import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../../store';
import DocumentPage from './../DocumentPage';

configure({ adapter: new Adapter() });

describe('<DocumentPage />', () => {
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
          <DocumentPage params={params} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('Documents').length).toBe(1);
  });
});
