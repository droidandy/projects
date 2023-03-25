import { connect } from 'react-redux';
import { addNewPerson, removeNewPerson, updateNewPerson, saveNewPersons } from '../actions';
import AddPerson from './AddPerson';

function mapStateToProps(state) {
  const salesState = state.get('sales');
  const overviewState = state.get('base');
  return {
    loading: salesState.get('loading'),
    sales: salesState.get('sales').toJS(),
    presales: salesState.get('presales').toJS(),
    newPeople: salesState.get('newPeople').toJS(),
    selectedCarrier: overviewState.get('selectedCarrier').toJS(),
    saving: salesState.get('saving'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addNewPerson: () => { dispatch(addNewPerson()); },
    saveNewPersons: () => { dispatch(saveNewPersons()); },
    removeNewPerson: (index) => { dispatch(removeNewPerson(index)); },
    updateNewPerson: (index, key, value, carrierId) => { dispatch(updateNewPerson(index, key, value, carrierId)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(AddPerson);
