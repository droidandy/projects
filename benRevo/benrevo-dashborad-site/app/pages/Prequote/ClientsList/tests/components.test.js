import React from 'react';
import { mount, configure,
 } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../../store';

import ClientsList from '../ClientsList';
import {
} from '../../constants';

configure({ adapter: new Adapter() });

describe('<ClientsList />', () => {
  let store;
  let renderedComponent;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
    renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ClientsList
            NewRfps={[
              {
                clientId: 2233,
                clientName: 'TestClientMedical NonVirgin  180524165816',
                presalesName: 'Stanislav Presales',
                brokerName: 'Stanislav Brokerage House',
                effectiveDate: 1528614000000,
                clientState: 'RFP_SUBMITTED',
                new: true,
              },
              {
                clientId: 2195,
                clientName: 'Test Client For Lemdy',
                presalesName: 'Stanislav Presales',
                brokerName: 'Stanislav Brokerage House',
                effectiveDate: 1558681200000,
                clientState: 'RFP_SUBMITTED',
                new: true,
              },
            ]}
            InProgress={[
              {
                clientId: 2173,
                clientName: 'Test Client For Lemdy',
                presalesName: 'Lemdy SAR',
                brokerName: 'Lemdy Brokerage House',
                effectiveDate: 1527318000000,
                clientState: 'OPPORTUNITY_IN_PROGRESS',
                new: false,
              },
              {
                clientId: 2077,
                clientName: 'Shawn Carrier Admin Tool Test 1',
                presalesName: 'Yusuf SAR',
                brokerName: 'Shawn Broker Houser',
                effectiveDate: 1530428400000,
                clientState: 'OPPORTUNITY_IN_PROGRESS',
                new: false,
              },
              {
                clientId: 2080,
                clientName: 'Kids Finally Went To Bed, Inc. ',
                presalesName: 'Yusuf SAR',
                brokerName: 'Eric Brokerage House',
                effectiveDate: 1530428400000,
                clientState: 'OPPORTUNITY_IN_PROGRESS',
                new: false,
              },
            ]}
            sort={{}}
            client={{}}
            getPreQuoted={() => {}}
            changePreQuotedSort={() => {}}
            saveClient={() => {}}
            quoteNewClient={() => {}}
            redirect={() => {}}
            loading={false}
          />
        </IntlProvider>
      </Provider>
        );
  });
  it('should render the ClientsList component', () => {
    const table = renderedComponent.find('table');
    expect(table.find('td').length).toBe(27);
    const filteredCells = renderedComponent.find('td').filterWhere((n) => n.text().length > 1);

    expect(filteredCells.first().text()).toBe('NEW RFPS RECEIVED');
    expect(filteredCells.last().text()).toBe('OPPORTUNITY_IN_PROGRESSView');
    expect(renderedComponent.find('Button').length).toBe(6);
  });
});

