import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import SetAgeRow from '../components/SetAgeRow';

configure({ adapter: new Adapter() });

describe('<SetAgeRow />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
    });
    store = mockStore(initialState);
  });
  it('should render the SetAgeRow component', () => {
    const section = 'life';
    const voluntaryRates = {
      employee: true,
      employeeT: true,
      rateChildADD: null,
      rateChildLife: null,
      rateEmpADD: null,
      rateSpouseADD: null,
      spouse: true,
      spouseBased: 'Employee Age',
      ages: [
        {
          currentEmp: null,
          currentEmpT: null,
          currentSpouse: null,
          from: 0,
          renewalEmp: null,
          renewalEmpT: null,
          renewalSpouse: null,
          to: 29,
        }, {
          currentEmp: null,
          currentEmpT: null,
          currentSpouse: null,
          from: 30,
          renewalEmp: null,
          renewalEmpT: null,
          renewalSpouse: null,
          to: 34,
        }, {
          currentEmp: null,
          currentEmpT: null,
          currentSpouse: null,
          from: 35,
          renewalEmp: null,
          renewalEmpT: null,
          renewalSpouse: null,
          to: 39,
        }, {
          currentEmp: null,
          currentEmpT: null,
          currentSpouse: null,
          from: 40,
          renewalEmp: null,
          renewalEmpT: null,
          renewalSpouse: null,
          to: 44,
        }, {
          currentEmp: null,
          currentEmpT: null,
          currentSpouse: null,
          from: 45,
          renewalEmp: null,
          renewalEmpT: null,
          renewalSpouse: null,
          to: 49,
        }, {
          currentEmp: null,
          currentEmpT: null,
          currentSpouse: null,
          from: 50,
          renewalEmp: null,
          renewalEmpT: null,
          renewalSpouse: null,
          to: 54,
        }, {
          currentEmp: null,
          currentEmpT: null,
          currentSpouse: null,
          from: 55,
          renewalEmp: null,
          renewalEmpT: null,
          renewalSpouse: null,
          to: 59,
        }, {
          currentEmp: null,
          currentEmpT: null,
          currentSpouse: null,
          from: 60,
          renewalEmp: null,
          renewalEmpT: null,
          renewalSpouse: null,
          to: 64,
        }, {
          currentEmp: null,
          currentEmpT: null,
          currentSpouse: null,
          from: 65,
          renewalEmp: null,
          renewalEmpT: null,
          renewalSpouse: null,
          to: 69,
        }, {
          currentEmp: null,
          currentEmpT: null,
          currentSpouse: null,
          from: 70,
          renewalEmp: null,
          renewalEmpT: null,
          renewalSpouse: null,
          to: null,
        },
      ],
    };
    const index = 0;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <SetAgeRow
            maxIndex={0}
            section={section}
            age={voluntaryRates.ages[0]}
            updateAgeForm={jest.fn()}
            index={index}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('NumberFormat').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.setAgeRow').hostNodes().length).toBe(1);
  });
});
