import React from 'react';
import { configure, mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from './../../../store';
import SendToListHistory from '../SendToListHistory';

configure({ adapter: new Adapter() });

describe('<SendToListHistory />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const carrierEmailList = [];
  const loading = false;
  const disclosure = {
    modifyDate: '2010-06-09T15:20:00-07:00',
    modifyBy: 'admin@admin.com',
  };
  it('should render the SendToListHistory component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <SendToListHistory
            carrierEmailList={carrierEmailList}
            getCarrierEmails={jest.fn()}
            changeApprove={jest.fn()}
            deleteEmail={jest.fn()}
            saveEmailList={jest.fn()}
            saveCarrierList={jest.fn()}
            loading={loading}
            disclosure={disclosure}
          />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find('.sent-to-list-history').length).toBe(1);
  });
});
