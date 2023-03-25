import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import CompanyDetailPage from './../';

configure({ adapter: new Adapter() });

describe('<CompanyDetailPage />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
    });
    store = mockStore(initialState);
  });

  it('should render its heading', () => {
    const renderedComponent = shallow(
      <Provider store={store}>
        <CompanyDetailPage />
      </Provider>
    );
    expect(renderedComponent.contains(<CompanyDetailPage />)).toBe(true);
  });

  it('should present the client page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <CompanyDetailPage loading={false} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('div').length).toBeGreaterThan(0);
  });
});
