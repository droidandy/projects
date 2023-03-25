import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../../store';

import Rater from '..';

configure({ adapter: new Adapter() });

describe('<Rater />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
    store.dispatch({
      type: 'app/Info/HISTORY_GET_SUCCESS',
      payload: [
        {
          name: 'SENT_TO_RATER',
          date: '2018-06-06 00:48:21.0',
          type: null,
          fileName: null,
        },
        {
          name: 'SENT_TO_RATER',
          date: '2018-06-19 10:19:06.0',
          type: null,
          fileName: null,
        },
      ],
    });
  });
  it('should render the Rater component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Rater
            params={{}}
          />
        </IntlProvider>
      </Provider>
    );
    const textarea = renderedComponent.find('textarea');
    textarea.simulate('keydown', { which: 'a' });

    const button = renderedComponent.find('button');
    button.simulate('click');

    expect(renderedComponent.find('div').length).toBe(31);

    store.dispatch({
      type: 'app/Rfp/CHANGE_NOTE',
      payload: 'testing text',
    });

    const rfp = store.getState().get('rfp');
    const rater = rfp.get('rater').toJS();
    expect(rater.note).toBe(textarea.text());

    const historyWrapper = renderedComponent.find('.history-date');
    expect(historyWrapper.length).toBe(2);
    expect(historyWrapper.first().text()).toBe('2018-06-06 00:48:21.0');
    expect(historyWrapper.last().text()).toBe('2018-06-19 10:19:06.0');
  });
});
