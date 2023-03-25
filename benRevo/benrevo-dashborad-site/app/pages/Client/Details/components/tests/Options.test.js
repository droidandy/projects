import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../../../store';
import Options from '../Options';

configure({ adapter: new Adapter() });

const fakeRole = ['SALES'];

describe('<Options />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the Options', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Options
            optionsProduct={'MEDICAL'}
            client={{
              quoteType: 'KAISER',
              probability: 'HIGH',
              effectiveDate: '111111111111',
              options: [{ quoteType: 'STANDARD', carrier: 'Anthem Blue Cross', planTypes: ['HMO', 'PPO'], id: 111 }],
              clientState: 'COOL TEST',
            }}
            optionDetails={{}}
            optionRiders={{}}
            clients={[]}
            productsList={[]}
            changeOptionsProduct={jest.fn()}
            getOption={jest.fn()}
            changeActivity={jest.fn()}
            changeAccessStatus={jest.fn()}
            role={fakeRole}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('div.option-name').length).toBe(1);
  });
});
