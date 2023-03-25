import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import Header from '../Header/Header';

configure({ adapter: new Adapter() });

describe('<Header />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({ profile: { brokerageRole: ['test'] } });
    store = mockStore(initialState);
  });

  const logo = { link: '123' };
  it('should render the Header', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Header
            location={'/'}
            CARRIER={'456'}
            brokerageRole={['123']}
            logo={logo}
            sendFeedback={() => {}}
            openFeedbackModal={() => {}}
            closeFeedbackModal={() => {}}
            feedbackModalOpen={false}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.header-logo').hostNodes().length).toBe(1);
  });
});
