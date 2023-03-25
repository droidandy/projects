import { fromJS } from 'immutable';
import reducer from '../reducer';
import * as actions from '../actions';
import { getBrokerageById, getSalesByEmail } from '../selectors';

describe('SalesPageReducer', () => {
  let state;

  beforeAll(() => {
    state = fromJS({
      sales: [],
      presales: [],
      managers: [],
      renewalSales: [],
      renewalManagers: [],
      brokerages: [],
      personOfInterest: {},
      brokerage: {},
      currentChildren: [],
      edit: false,
      delete: false,
      loading: false,
      saving: false,
      searchText: '',
      newPeople: [{ firstName: '', lastName: '', email: '', type: '' }],
      carrierId: -1,
      POICurrentRole: '',
    });
  });

  it('CHANGE_BROKERAGE', () => {
    const mockAction = actions.changeBrokerage('1234');
    const mockState = state
      .setIn(['brokerage'], fromJS(getBrokerageById(mockAction.payload, state.get('brokerages').toJS())));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('UPDATE_BROKERAGE', () => {
    const mockAction = actions.updateBrokerage('sales', { email: 'cool@test.com', firstName: 'John', lastName: 'Doe', personId: 1 });
    const type = mockAction.payload.type;
    const list = (type === 'sales') ? state.get('sales') : state.get('presales');
    const item = getSalesByEmail(mockAction.payload.value, list.toJS());
    const mockState = state
      .setIn(['brokerage', `${type}Email`], item.email)
      .setIn(['brokerage', `${type}FirstName`], item.firstName)
      .setIn(['brokerage', `${type}LastName`], item.lastName)
      .setIn(['brokerage', `${type}Id`], item.personId);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('BROKERAGE_SAVE', () => {
    const mockAction = actions.saveBrokerage();
    const mockState = state
      .setIn(['saving'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('PERSONS_SAVE_NEW', () => {
    const mockAction = actions.saveNewPersons();
    const mockState = state
      .setIn(['saving'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('PERSONS_SAVE', () => {
    const mockAction = actions.savePersons();
    const mockState = state
      .setIn(['saving'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('PERSONS_GET', () => {
    const mockAction = actions.getPersons();
    const mockState = state
      .setIn(['loading'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('PERSONS_GET_SUCCESS', () => {
    const mockAction = { payload: { sales: [], presales: [], managers: [], renewalManagers: [], renewalSales: [] } };
    const mockState = state
      .setIn(['sales'], fromJS(mockAction.payload.sales))
      .setIn(['presales'], fromJS(mockAction.payload.presales))
      .setIn(['managers'], fromJS(mockAction.payload.managers))
      .setIn(['renewalManagers'], fromJS(mockAction.payload.renewalManagers))
      .setIn(['renewalSales'], fromJS(mockAction.payload.renewalSales))
      .setIn(['edit'], false)
      .setIn(['delete'], false)
      .setIn(['saving'], false)
      .setIn(['loading'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('PERSONS_GET_ERROR', () => {
    const mockAction = { payload: [] };
    const mockState = state
      .setIn(['loading'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('BROKERAGE_GETS_SUCCESS', () => {
    const mockAction = { payload: [] };
    const mockState = state
      .setIn(['brokerages'], fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('NEW_POI', () => {
    const mockAction = actions.newPOI({ type: 'cool' }, 'edit');
    const mockState = state
      .setIn(['personOfInterest'], fromJS(mockAction.payload.person))
      .setIn(['personOfInterest', 'newBrokerageList'], fromJS([]))
      .setIn(['POICurrentRole'], fromJS(mockAction.payload.person.type))
      .setIn([mockAction.payload.action], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('PERSON_UPDATE', () => {
    const mockAction = actions.updatePerson({ key: 'key', value: 'value' });
    const mockState = state
      .setIn(['personOfInterest', mockAction.payload.key], mockAction.payload.value);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('PERSON_CANCEL', () => {
    const mockAction = actions.cancelPerson();
    const mockState = state
      .setIn(['edit'], false)
      .setIn(['delete'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('ADD_NEW_PERSON', () => {
    const mockAction = actions.addNewPerson();
    const newArray = state.get('newPeople').push(fromJS({ firstName: '', lastName: '', fullName: '', email: '', type: '' }));
    const mockState = state
      .setIn(['newPeople'], newArray);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('REMOVE_NEW_PERSON', () => {
    const mockAction = actions.removeNewPerson(0);
    const newArray = state.get('newPeople').delete(mockAction.payload.index);
    const mockState = state
      .setIn(['newPeople'], newArray);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('UPDATE_NEW_PERSON', () => {
    const mockAction = actions.updateNewPerson(0, 'key', 'value', 1337);
    const mockState = state
      .setIn(['newPeople', mockAction.payload.index, mockAction.payload.key], mockAction.payload.value)
      .setIn(['newPeople', mockAction.payload.index, 'carrierId'], mockAction.payload.carrierId);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SEARCH_TEXT_UPDATE', () => {
    const mockAction = actions.updateSearchText('test value');
    const mockState = state
      .setIn(['searchText'], mockAction.payload.value);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHILDREN_GET_SUCCESS', () => {
    const mockAction = { payload: [] };
    const mockState = state
      .setIn(['currentChildren'], fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHILDREN_GET_ERROR', () => {
    const mockAction = { payload: [] };
    const mockState = state
      .setIn(['loading'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
});
