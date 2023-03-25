import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import PropTypes from 'prop-types';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import 'whatwg-fetch';
import App from '../App';
configure({ adapter: new Adapter() });

describe('<App />', () => {
  const initialState = fromJS({ profile: { brokerageRole: ['test'] } });
  let store = {};
  beforeAll(() => {
    store = configureStore([])(initialState);
  });

  const location = {
    pathname: '/anthem',
  };
  const mixpanel = {};
  const routes = [
    { name: 'home' },
    { name: 'anthem' },
  ];
  const logo = {
    link: '/',
  };
  it('should render the AppPage', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <App
            checkRole={() => {}}
            location={location}
            mixpanel={mixpanel}
            routes={routes}
            logo={logo}
            CARRIER={'test123'}
            sendFeedback={() => {}}
            openFeedbackModal={() => {}}
            closeFeedbackModal={() => {}}
            feedbackModalOpen={false}
            brokerageRole={['coolTest123']}
          />
        </IntlProvider>
      </Provider>, {
        context: { mixpanel: { track: jest.fn() } },
        childContextTypes: { mixpanel: PropTypes.object },
      },
    );

    expect(renderedComponent.find('.container-center').length).toBe(1);
  });
});
