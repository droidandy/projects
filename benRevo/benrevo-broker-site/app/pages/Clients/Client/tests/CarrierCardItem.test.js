import React from 'react';
import { configure, mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from './../../../../store';
import CarrierCardItem from '../components/CarrierCardItem';

configure({ adapter: new Adapter() });

describe('<CarrierCardItem />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const carrier = {};
  const clientId = '1';
  it('should render the CarrierCardItem component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <CarrierCardItem
            clientId={clientId}
            updateMarketingStatusItem={jest.fn()}
            carrier={carrier}
            deleteCarrier={jest.fn()}
            section="medical"
          />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find('.carrier-card-item').length).toBe(2);
  });
});
