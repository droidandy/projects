import React from 'react';
import { Map, List } from 'immutable';
import { mount, configure, shallow,
 } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../../store';

import Quote from '..';
import QuoteComponent from '../Quote';
import { RECEIVE_DOWNLOADED_QUOTES,
} from '../../constants';

configure({ adapter: new Adapter() });

describe('<Quote />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
    store.dispatch({ type: RECEIVE_DOWNLOADED_QUOTES,
      payload: [
      { name: 'Medical_with_kaiser', date: '2018-05-22 22:38:36.0', type: 'KAISER', filename: 'SampleQuote.xls' },
      { name: 'Medical_without_kaiser', date: '2018-05-22 22:38:36.0', type: 'KAISER', filename: 'SampleQuote.xls' },
      { name: 'Dental', date: '2018-05-22 22:38:36.0', type: 'KAISER', filename: 'SampleQuote.xls' },
      { name: 'Vision', date: '2018-05-22 22:38:36.0', type: 'KAISER', filename: 'SampleQuote.xls' },
      ] });
  });
  it('should render the Quote component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Quote
            uploadQuote={Map({
              errors: List([
                Map({
                }),
              ]),
            })}
          />
        </IntlProvider>
      </Provider>
    );

    const rfp = store.getState().get('rfp');
    const uploadQuote = rfp.get('uploadQuote');

    expect(uploadQuote.get('files').toJS().length).toBe(4);
    const table = renderedComponent.find('table').find('tr');
    expect(table.length).toBe(11);

    const cells = renderedComponent.find('td');
    expect(cells.length).toBe(40);
    const filteredCells = renderedComponent.find('td').filterWhere((n) => n.text().length > 1);
    expect(filteredCells.length).toEqual(8);

    expect(filteredCells.first().text()).toBe('Medical_with_kaiser');
    expect(filteredCells.last().text()).toBe('2018-05-22 22:38:36.0');
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
  });


  test('should render Quote component for testing quote-delete buttons', () => {
    const testDeleting = jest.fn();
    const wrapper = shallow(
      <QuoteComponent
        getDownloadedQuotes={() => {}}
        validateQuote={() => {}}
        removeQuote={testDeleting}
        setQuoteType={() => {}}
        selectQuoteType={() => {}}
        closeQuoteTypesModal={() => {}}
        closeUploadQuotesErrorsModal={() => {}}
        client={{ id: 1000 }}
        uploadQuote={Map({
          files: List([
            Map({
              name: 'Dental',
              date: '2018-05-18 12:37:45.0',
              type: null,
              fileName: 'Sample_Standard_Quote_5.xls',
            }),
            Map({
              name: 'Vision',
              date: '2018-05-23 10:39:43.0',
              type: null,
              fileName: 'Sample_Standard_Quote_5.xls' }),
          ]),
          errors: List([
            Map({
            }),
          ]),
        })}
      />);
    wrapper.find('button').forEach((node) => {
      node.simulate('click');
    });
    expect(testDeleting).toHaveBeenCalledTimes(2);
  });
});
