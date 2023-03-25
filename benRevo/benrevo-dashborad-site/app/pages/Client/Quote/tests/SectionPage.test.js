import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import Adapter from 'enzyme-adapter-react-16';
import {
  PresentationSection,
} from '@benrevo/benrevo-react-quote';
import configureStore from '../../../../store';
import SectionPage from './../SectionPage';

configure({ adapter: new Adapter() });

describe('<SectionPage />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const routes = [
    {},
    {},
    {},
    {
      path: 'medical',
    },
  ];
  const params = {
    clientId: 1,
  };

  it('should render itself', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <SectionPage params={params} routes={routes} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find(PresentationSection).length).toBe(1);
  });
});
