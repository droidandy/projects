import React from 'react';
import {
  shallow,
  mount,
  configure,
} from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../../store';
import Tools from '..';
import ToolsShallow from '../Tools';


configure({ adapter: new Adapter() });

describe('<Tools />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  it('should render the Tools component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <Tools openModal closeModal={() => {}} section="medical" />
        </IntlProvider>
      </Provider>);

    expect(renderedComponent.length).toBe(1);
  });
});

describe('<ToolsShallow />', () => {
  test('should render ToolsShallow component', () => {
    const wrapper = shallow(
      <ToolsShallow
        openModal
        section="medical"
        closeModal={() => {}}
        getComparison={() => {}}
        loading={false}
        providersRows={
          {
            uhc: [
              {
                medicalGroupId: 552,
                decNumber: '4209',
                name: 'BAKERSFIELD FAMILY MEDICAL CENTER',
                county: 'KERN',
                region: 'Southern California',
                state: 'California',
                networks: [
                  {
                    networkId: 25,
                    name: 'Signature',
                    type: 'HMO',
                  },
                  {
                    networkId: 26,
                    name: 'Advantage',
                    type: 'HMO',
                  },
                  {
                    networkId: 27,
                    name: 'Alliance',
                    type: 'HMO',
                  },
                ],
              },
            ],
          }
        }
        providersCols={
          {
            uhc: {
              Signature: true,
              Advantage: true,
              Alliance: true,
              Focus: true,
            },
            anthem: {
              'Traditional Network': true,
              'Select Network': true,
              'Priority Select Network': true,
              'Vivity Network': true,
            },
          }
        }
      />);
    expect(wrapper.find('div').text()).toEqual('<Tab />');
  });
});
