import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import Adapter from 'enzyme-adapter-react-16';
import {
  Comparsion,
} from '@benrevo/benrevo-react-quote';
import configureStore from '../../../../store';
import ComparisonPage from './../sub/ComparisonPage';

configure({ adapter: new Adapter() });

describe('<ComparisonPage />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  const section = 'medical';

  it('should render itself', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ComparisonPage section={section} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find(Comparsion).length).toBe(1);
  });
});
