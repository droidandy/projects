import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TableItem from '../components/TableItem';
configure({ adapter: new Adapter() });

describe('<TableItem />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({});
    store = mockStore(initialState);
  });

  const item = {
    name: 'Pre-Implementation',
    timelines: [
      {
        timelineId: 552,
        refNum: 1,
        clientId: 284,
        carrierId: 3,
        milestone: 'Confirm Final Notification of Sale',
        assignee: 'CV Client Full',
        projectedTime: 'Dec 6, 2017 9:00:00 PM',
        completed: true,
        completedTime: 'Oct 5, 2017 12:22:05 PM',
      }, {
        timelineId: 566,
        refNum: 1,
        clientId: 284,
        carrierId: 3,
        milestone: 'Confirm Final Notification of Sale',
        assignee: 'CV Client Full',
        projectedTime: '08/25/2017',
        completed: true,
        completedTime: '10/05/2017',
        selected: true,
      }, {
        timelineId: 567,
        refNum: 2,
        clientId: 284,
        carrierId: 3,
        milestone: 'Complete Group Application',
        assignee: 'Krappt Brokerage House / CV Client Full',
        projectedTime: 'Sep 7, 2020 9:00:00 PM',
        completed: false,
      },
    ],
  };

  it('should render the TableItem component', () => {
    const admin = false;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <TableItem
            key={1}
            item={item.timelines[0]}
            index={2}
            updateProjectTime={jest.fn()}
            updateCompleted={jest.fn()}
            admin={admin}
          />
        </IntlProvider>
      </Provider>
    );

    renderedComponent.find('input').forEach((input) => {
      input.simulate('change');
    });

    renderedComponent.find('button').forEach((button) => {
      button.simulate('click');
    });

    expect(renderedComponent.find('.timelineBody').length).toBe(2);
    expect(renderedComponent.find('.completedDate').length).toBe(2);
  });

  it('should render button to complete item', () => {
    const admin = true;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <TableItem
            key={1}
            item={item.timelines[2]}
            index={2}
            updateProjectTime={jest.fn()}
            updateCompleted={jest.fn()}
            admin={admin}
          />
        </IntlProvider>
      </Provider>
    );

    renderedComponent.find('input').forEach((input) => {
      input.simulate('change');
    });

    renderedComponent.find('button').forEach((button) => {
      button.simulate('click');
    });

    expect(renderedComponent.find('.completedDate').length).toBe(0);
    expect(renderedComponent.find('.complete-button').length).toBe(2);
  });

  it('should render adminCompleted', () => {
    const admin = true;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <TableItem
            key={1}
            item={item.timelines[1]}
            index={2}
            updateProjectTime={jest.fn()}
            updateCompleted={jest.fn()}
            admin={admin}
          />
        </IntlProvider>
      </Provider>
    );

    renderedComponent.find('input').forEach((input) => {
      input.simulate('change');
    });

    renderedComponent.find('button').forEach((button) => {
      button.simulate('click');
    });

    expect(renderedComponent.find('td').first().text()).toBe('1');
    expect(renderedComponent.find('td').at(1).text()).toBe('Confirm Final Notification of Sale');
    expect(renderedComponent.find('td').at(2).text()).toBe('CV Client Full');
    expect(renderedComponent.find('.timelineBody.row-selected').length).toBe(2);
    expect(renderedComponent.find('.completed-time').text()).toBe('Completed 10-05-2017');
  });
});
