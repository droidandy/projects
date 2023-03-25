import { fromJS } from 'immutable';
import * as types from './constants';
import { getBrokerageById, getSalesByEmail } from './selectors';

const initialState = fromJS({
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

function SalesReducer(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_BROKERAGE: {
      if (action.payload) {
        return state
          .setIn(['brokerage'], fromJS(getBrokerageById(action.payload, state.get('brokerages').toJS())));
      }
      return state;
    }
    case types.UPDATE_BROKERAGE: {
      const type = action.payload.type;
      let list = [];
      if (type === 'sales') {
        list = state.get('sales');
      } else if (type === 'presales') {
        list = state.get('presales');
      } else {
        state.get('renewalSales');
      }
      const item = getSalesByEmail(action.payload.value, list.toJS());
      return state
        .setIn(['brokerage', `${type}Email`], item.email)
        .setIn(['brokerage', `${type}FirstName`], item.firstName)
        .setIn(['brokerage', `${type}LastName`], item.lastName)
        .setIn(['brokerage', `${type}Id`], item.personId);
    }
    case types.BROKERAGE_SAVE: {
      return state
        .setIn(['saving'], true);
    }
    case types.BROKERAGE_SAVE_SUCCESS: {
      return state
        .setIn(['saving'], false);
    }
    case types.BROKERAGE_SAVE_ERROR: {
      return state
        .setIn(['saving'], false);
    }
    case types.PERSONS_SAVE_NEW: {
      return state
        .setIn(['saving'], true);
    }
    case types.PERSONS_SAVE: {
      return state
        .setIn(['saving'], true);
    }
    case types.PERSONS_SAVE_ERROR: {
      return state
        .setIn(['saving'], false);
    }
    case types.PERSONS_GET: {
      return state
        .setIn(['loading'], true);
    }
    case types.PERSONS_GET_SUCCESS: {
      return state
        .setIn(['sales'], fromJS(action.payload.sales))
        .setIn(['presales'], fromJS(action.payload.presales))
        .setIn(['managers'], fromJS(action.payload.managers))
        .setIn(['renewalManagers'], fromJS(action.payload.renewalManagers))
        .setIn(['renewalSales'], fromJS(action.payload.renewalSales))
        .setIn(['currentChildren'], fromJS([]))
        .setIn(['edit'], false)
        .setIn(['delete'], false)
        .setIn(['saving'], false)
        .setIn(['loading'], false);
    }
    case types.PERSONS_GET_ERROR: {
      return state
        .setIn(['loading'], false);
    }
    case types.BROKERAGE_GETS_SUCCESS: {
      return state
        .setIn(['brokerages'], fromJS(action.payload));
    }
    case types.NEW_POI: {
      return state
        .setIn(['personOfInterest'], fromJS(action.payload.person))
        .setIn(['personOfInterest', 'newBrokerageList'], fromJS([]))
        .setIn(['POICurrentRole'], fromJS(action.payload.person.type))
        .setIn([action.payload.action], true);
    }
    case types.PERSON_UPDATE: {
      return state
        .setIn(['personOfInterest', action.payload.key], action.payload.value);
    }
    case types.PERSON_CANCEL: {
      return state
        .setIn(['edit'], false)
        .setIn(['currentChildren'], fromJS([]))
        .setIn(['delete'], false);
    }
    case types.ADD_NEW_PERSON: {
      const newArray = state.get('newPeople').push(fromJS({ firstName: '', lastName: '', fullName: '', email: '', type: '' }));
      return state
        .setIn(['newPeople'], newArray);
    }
    case types.PERSONS_ADD_SUCCESS: {
      return state
        .setIn(['saving'], false)
        .setIn(['newPeople'], fromJS([{ firstName: '', fullName: '', lastName: '', email: '', type: '' }]));
    }
    case types.REMOVE_NEW_PERSON: {
      const newArray = state.get('newPeople').delete(action.payload.index);
      return state
        .setIn(['newPeople'], newArray);
    }
    case types.UPDATE_NEW_PERSON: {
      return state
        .setIn(['newPeople', action.payload.index, action.payload.key], action.payload.value)
        .setIn(['newPeople', action.payload.index, 'carrierId'], action.payload.carrierId);
    }
    case types.SEARCH_TEXT_UPDATE: {
      return state
        .setIn(['searchText'], action.payload.value);
    }
    case types.CHILDREN_GET_ERROR: {
      return state
        .setIn(['loading'], false);
    }
    case types.CHILDREN_GET_SUCCESS: {
      return state
        .setIn(['currentChildren'], fromJS(action.payload));
    }
    case types.UPDATE_CHILDREN: {
      if (state.getIn(['currentChildren', action.payload.index])) {
        const sales = state.get('sales').toJS();
        const presales = state.get('presales').toJS();
        const managers = state.get('managers').toJS();
        const renewalSales = state.get('renewalSales').toJS();
        const renewalManagers = state.get('renewalManagers').toJS();
        const person = getSalesByEmail(action.payload.value, sales.concat(presales).concat(managers).concat(renewalSales).concat(renewalManagers));
        person.added = true;
        return state
          .setIn(['currentChildren', action.payload.index], fromJS(person));
      }
      return state
        .setIn(['currentChildren', action.payload.index], fromJS(action.payload.value));
    }
    case types.REMOVE_CHILDREN: {
      const child = state.getIn(['currentChildren', action.payload.index]).toJS();
      if (child.added) {
        const newState = state.get('currentChildren').delete(action.payload.index);
        return state
          .setIn(['currentChildren'], newState);
      }
      return state
      .setIn(['currentChildren', action.payload.index, 'removed'], true);
    }
    default:
      return state;
  }
}

export default SalesReducer;
