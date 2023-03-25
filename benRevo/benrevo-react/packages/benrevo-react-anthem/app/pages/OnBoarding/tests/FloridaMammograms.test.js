import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import FloridaMammograms from './../questions/misc/FloridaMammograms';

configure({ adapter: new Adapter() });

describe('<FloridaMammograms />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  it('should render the FloridaMammograms page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <FloridaMammograms />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.ArkansasHearingAid').length).toBe(1);
  });
});
