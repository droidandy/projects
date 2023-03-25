import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import Adapter from 'enzyme-adapter-react-16';
import {
  Options,
} from '@benrevo/benrevo-react-quote';
import configureStore from '../../../../store';
import OptionsPage from './../sub/OptionsPage';

configure({ adapter: new Adapter() });

describe('<OptionsPage />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  const section = 'medical';

  it('should render itself', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <OptionsPage section={section} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find(Options).length).toBe(1);
  });
});
