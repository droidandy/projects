import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../../store';
import NavigationPresentation from './../';

configure({ adapter: new Adapter() });

describe('<NavigationPresentation />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render itself', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <NavigationPresentation />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.top-navigation').length).toBe(1);
  });
});
