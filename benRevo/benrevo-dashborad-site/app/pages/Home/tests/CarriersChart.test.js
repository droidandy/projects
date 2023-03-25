import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../store';
import CarriersChart from './../components/Carriers';

configure({ adapter: new Adapter() });

describe('<CarriersChart />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  it('should render the CarriersChart page', () => {
    const productsList = [];
    const title = '';
    const product = {};
    const data = [];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <CarriersChart
            productsList={productsList}
            title={title}
            product={product}
            changeProduct={jest.fn()}
            setFilters={jest.fn()}
            data={data}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.card-main').length).toBe(2);
    expect(renderedComponent.find('.empty-body').length).toBe(1);
  });
  it('should render the CarriersChart page', () => {
    const productsList = [];
    const title = '';
    const product = {};
    const data = [
      {
        logoUrl: '/123/',
        avgDiffPercent: 1,
        medianDiffPercent: -4,
      },
    ];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <CarriersChart
            productsList={productsList}
            title={title}
            product={product}
            changeProduct={jest.fn()}
            setFilters={jest.fn()}
            data={data}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.card-main').length).toBe(2);
    expect(renderedComponent.find('.data-table').length).toBe(2);
  });
});
