import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import Adapter from 'enzyme-adapter-react-16';
import {
  Alternatives,
} from '@benrevo/benrevo-react-quote';
import configureStore from '../../../../store';
import AlternativesPage from './../sub/AlternativesPage';

configure({ adapter: new Adapter() });

describe('<AlternativesPage />', () => {
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
          <AlternativesPage section={section} carrier={carrier} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find(Alternatives).length).toBe(1);
  });
});
