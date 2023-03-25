import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import SelectPerson from '../Brokerage/components/SelectPerson';

describe('<SelectPerson />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  const presales = [];
  const brokerage = {};
  it('should render SelectPerson component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <SelectPerson
            title="PreSales"
            list={presales}
            brokerage={brokerage}
            itemKey={'presalesEmail'}
            updateBrokerage={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.select-person').length).toBe(1);
  });
});
