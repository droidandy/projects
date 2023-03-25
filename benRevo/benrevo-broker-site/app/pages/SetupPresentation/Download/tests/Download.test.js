import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../../store';

import Download from '..';


configure({ adapter: new Adapter() });

describe('<Download />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  it('should render the Download component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Download params={{ clientId: '200' }} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('div').length).toBe(29);

    const filteredRows = renderedComponent.find('div').filterWhere((div) => div.text().length > 1);
    expect(filteredRows.length).toBe(28);
    expect(filteredRows.last().text().length > 600);
    expect(renderedComponent.containsAllMatchingElements([
      <div role="listitem" className="item">3. Financial Summary (Current/Renewal)</div>,
      <div role="listitem" className="item">7. Medical Alternatives</div>,
      <div role="listitem" className="item">10. Timeline and Next Steps</div>,
    ])).toBe(true);
  });
});
