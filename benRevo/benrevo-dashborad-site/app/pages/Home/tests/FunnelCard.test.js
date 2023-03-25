import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../store';
import FunnelCard from './../components/FunnelCard';

configure({ adapter: new Adapter() });

describe('<FunnelCard />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the FunnelCard Card', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <FunnelCard
            productsList={[]}
            product={'TEST'}
            getFunnelData={jest.fn()}
            funnelData={{}}
          />
        </IntlProvider>
      </Provider>
    );

    // .hostNodes() makes sure the test only checks DOM, which eliminates duplicates
    expect(renderedComponent.find('.card-main').hostNodes().length).toBe(1);
    expect(renderedComponent.find('.funnel-grid').hostNodes().length).toBe(1);
  });
});
