import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import TexasInVitro from './../questions/misc/TexasInVitro';

configure({ adapter: new Adapter() });

describe('<TexasInVitro />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  it('should render the TexasInVitro page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <TexasInVitro />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.ArkansasHearingAid').length).toBe(1);
    expect(renderedComponent.find('p').length).toBe(2);
  });
});
