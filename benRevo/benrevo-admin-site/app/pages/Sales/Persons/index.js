import { connect } from 'react-redux';
import { removeChildren, cancelPerson, savePersons, updatePerson, updateSearchText, newPOI, updateChildren } from '../actions';
import { selectFullPersonnelList, selectBrokerageList, selectPersonnelList } from '../selectors';
import Persons from './Persons';

function mapStateToProps(state) {
  const salesState = state.get('sales');
  return {
    loading: salesState.get('loading'),
    saving: salesState.get('saving'),
    fullBrokerageList: salesState.get('brokerages').toJS(),
    personOfInterest: salesState.get('personOfInterest').toJS(),
    searchText: salesState.get('searchText'),
    currentChildren: salesState.get('currentChildren').toJS(),
    POICurrentRole: salesState.get('POICurrentRole'),
    brokerages: selectBrokerageList(state),
    personnelList: selectPersonnelList(state),
    fullPersonnelList: selectFullPersonnelList(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    cancelPerson: () => { dispatch(cancelPerson()); },
    updateChildren: (index, value) => { dispatch(updateChildren(index, value)); },
    removeChildren: (index) => { dispatch(removeChildren(index)); },
    newPOI: (person, action) => { dispatch(newPOI(person, action)); },
    savePersons: () => { dispatch(savePersons()); },
    updatePerson: (key, value) => { dispatch(updatePerson(key, value)); },
    updateSearchText: (value) => { dispatch(updateSearchText(value)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Persons);
