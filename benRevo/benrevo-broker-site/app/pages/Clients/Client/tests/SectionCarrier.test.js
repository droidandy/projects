import React from 'react';
import { configure, mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import { MEDICAL_SECTION } from '@benrevo/benrevo-react-clients';
import configureStore from './../../../../store';
import SectionCarrier from '../components/SectionCarrier';

configure({ adapter: new Adapter() });

describe('<SectionCarrier />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const marketingStatusList = [];
  const clientId = '1';
  it('should render the SectionCarrier component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <SectionCarrier
            section={MEDICAL_SECTION}
            openAddCarrierModal={jest.fn()}
            marketingStatusList={marketingStatusList}
            updateMarketingStatusItem={jest.fn()}
            deleteCarrier={jest.fn()}
            clientId={clientId}
          />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find('.section-carrier').length).toBe(1);
  });
});
