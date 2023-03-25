import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from '../../../../store';
import Carrier from '../index';
import CarrierCheck from '../components/CarrierCheck';

configure({ adapter: new Adapter() });

describe('<Carrier  />', () => {
  let store;
  const routes = [
    {},
    {
      childRoutes: [],
    },
    {
      childRoutes: [
        {
          path: 'medical',
        },
        {
          path: 'medical',
        },
        {
          path: 'test3',
        },
      ],
    },
    {
      path: 'medical',
    },
    {
      path: 'medical',
    },
    {
      path: 'medical',
    },
  ];

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the CarrierCheck', () => {
    const renderedComponent = mount(<Provider store={store}><Carrier routes={routes} route={routes[1]} /></Provider>);
    expect(renderedComponent.find(CarrierCheck).length).toBe(1);
  });
});
