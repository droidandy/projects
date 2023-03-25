import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import EnrollmentTable from '../components/EnrollmentTable';

configure({ adapter: new Adapter() });

describe('<EnrollmentTable />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
    });
    store = mockStore(initialState);
  });

  it('should render enrollment table', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <EnrollmentTable
          data={{}}
          edit={false}
          changeEnrollment={jest.fn()}
          cancelEnrollment={jest.fn()}
          saveEnrollment={jest.fn()}
          editEnrollment={jest.fn()}
          name="medical"
        />
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.card-contributions-container').hostNodes().length).toBe(1);
  });
  it('should render enrollment table with class edit', () => {
    const edit = true;
    const renderedComponent = mount(
      <Provider store={store}>
        <EnrollmentTable
          data={{}}
          edit={edit}
          changeEnrollment={jest.fn()}
          cancelEnrollment={jest.fn()}
          saveEnrollment={jest.fn()}
          editEnrollment={jest.fn()}
          name="medical"
        />
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.card-contributions-container.edit').hostNodes().length).toBe(1);
  });
  it('should render enrollment table 2 card-bottom buttons', () => {
    const edit = true;
    const data = {
      networks: [
        { planName: '123', type: 'medical' },
        { planName: '234', type: 'dental' },
        { planName: '345', type: 'vision' },
      ],
      contributions: [
        { planName: '123', type: 'medical', values: [{ value: '1' }, { value: '2' }] },
        { planName: '234', type: 'dental', values: [{ value: '2' }, { value: '3' }] },
        { planName: '345', type: 'vision', values: [{ value: '3' }, { value: '4' }] },
      ],
      total: ['123', '234'],
    };
    const renderedComponent = mount(
      <Provider store={store}>
        <EnrollmentTable
          data={data}
          edit={edit}
          changeEnrollment={jest.fn()}
          cancelEnrollment={jest.fn()}
          saveEnrollment={jest.fn()}
          editEnrollment={jest.fn()}
          name="medical"
        />
      </Provider>
    );
    expect(renderedComponent.find('.card-bottom button').length).toBe(2);
  });
  it('should render edit button', () => {
    const edit = false;
    const data = {
      networks: [
        { planName: '123', type: 'medical' },
        { planName: '234', type: 'dental' },
        { planName: '345', type: 'vision' },
      ],
      contributions: [
        { planName: '123', type: 'medical', values: [{ value: '1' }, { value: '2' }] },
        { planName: '234', type: 'dental', values: [{ value: '2' }, { value: '3' }] },
        { planName: '345', type: 'vision', values: [{ value: '3' }, { value: '4' }] },
      ],
      total: ['123', '234'],
    };
    const renderedComponent = mount(
      <Provider store={store}>
        <EnrollmentTable
          data={data}
          edit={edit}
          changeEnrollment={jest.fn()}
          cancelEnrollment={jest.fn()}
          saveEnrollment={jest.fn()}
          editEnrollment={jest.fn()}
          name="medical"
        />
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.edit-btn').hostNodes().length).toBe(1);
  });
  it('should render edit data.networks', () => {
    const edit = false;
    const data = {
      networks: [
        { planName: '123', type: 'medical' },
        { planName: '234', type: 'dental' },
        { planName: '345', type: 'vision' },
      ],
    };
    const renderedComponent = mount(
      <Provider store={store}>
        <EnrollmentTable
          data={data}
          edit={edit}
          changeEnrollment={jest.fn()}
          cancelEnrollment={jest.fn()}
          saveEnrollment={jest.fn()}
          editEnrollment={jest.fn()}
          name="medical"
        />
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.plan-name').length).toBe(3);
  });

  it('should render edit data.contributions', () => {
    const edit = false;
    const data = {
      contributions: [
        { planName: '123', type: 'medical', values: [{ value: '1' }, { value: '2' }] },
        { planName: '234', type: 'dental', values: [{ value: '2' }, { value: '3' }] },
        { planName: '345', type: 'vision', values: [{ value: '3' }, { value: '4' }] },
      ],
      total: ['123', '234'],
    };
    const renderedComponent = mount(
      <Provider store={store}>
        <EnrollmentTable
          data={data}
          edit={edit}
          changeEnrollment={jest.fn()}
          cancelEnrollment={jest.fn()}
          saveEnrollment={jest.fn()}
          editEnrollment={jest.fn()}
          name="medical"
        />
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.card-contributions-row').hostNodes().length).toBe(4);
  });
});
