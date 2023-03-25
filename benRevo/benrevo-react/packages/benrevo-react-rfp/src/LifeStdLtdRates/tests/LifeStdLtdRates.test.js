import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { initialRfpMasterState } from './../../reducer/state';
import LifeStdLtdRates from '../';

configure({ adapter: new Adapter() });

describe('<LifeStdLtdRates />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      rfp: initialRfpMasterState,
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
  });


  it('should render the LifeStdLtdRates component abnd life section', () => {
    const routes = [
      {
        path: '',
      }, {
        path: '',
      }, {
        path: '',
      }, {
        path: 'life',
      }, {
        path: 'std',
      }, {
        path: 'ltd',
      },
    ];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <LifeStdLtdRates routes={routes} />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    renderedComponent.find('NumberFormat').forEach((node) => {
      node.simulate('change');
    });
    renderedComponent.find('Radio').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.gridSegment').hostNodes().length).toBe(1);
    expect(renderedComponent.find('.basic-row').hostNodes().length).toBe(1);
    expect(renderedComponent.find('.life-section').hostNodes().length).toBe(1);
  });
  it('should render the LifeStdLtdRates std-section', () => {
    const routes = [
      {
        path: '',
      }, {
        path: '',
      }, {
        path: '',
      }, {
        path: 'std',
      }, {
        path: 'life',
      }, {
        path: 'ltd',
      },
    ];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <LifeStdLtdRates routes={routes} />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    renderedComponent.find('NumberFormat').forEach((node) => {
      node.simulate('change');
    });
    renderedComponent.find('Radio').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.gridSegment').hostNodes().length).toBe(1);
    expect(renderedComponent.find('.basic-row').hostNodes().length).toBe(1);
    expect(renderedComponent.find('.life-section').hostNodes().length).toBe(0);
    expect(renderedComponent.find('.std-section').hostNodes().length).toBe(1);
  });
  it('should render the LifeStdLtdRates ltd-section', () => {
    const routes = [
      {
        path: '',
      }, {
        path: '',
      }, {
        path: '',
      }, {
        path: 'std',
      }, {
        path: 'life',
      }, {
        path: 'ltd',
      },
    ];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <LifeStdLtdRates routes={routes} />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    renderedComponent.find('NumberFormat').forEach((node) => {
      node.simulate('change');
    });
    renderedComponent.find('Radio').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.gridSegment').hostNodes().length).toBe(1);
    expect(renderedComponent.find('.basic-row').hostNodes().length).toBe(1);
    expect(renderedComponent.find('.life-section').hostNodes().length).toBe(0);
    expect(renderedComponent.find('.std-section').hostNodes().length).toBe(1);
  });
});
