import { connect } from 'react-redux';
import {
  selectSectionTitle,
} from '@benrevo/benrevo-react-rfp';
import RateProduct from './RateProduct';
import {
  getRateBank, changeSentBank, changeEditTable,
  saveTableData, editTableInput, changeEditBadget, getHistoryBank,
  editBudgetInput, sendToBank, saveBudgetData, rateBankSuccess,
} from '../actions';
import { KAISER_SECTION } from '../constants';

function mapStateToProps(state, ownProps) {
  const section = ownProps.routes[5].path;
  const quoteType = section === KAISER_SECTION ? 'KAISER' : 'STANDARD';
  const bankState = state.get('rfp').get('bank');
  const clientsState = state.get('clients');

  return {
    section,
    quoteType,
    client: clientsState.get('current').toJS(),
    isEdit: bankState.get('isTableEdit'),
    isBudgetEdit: bankState.get('isBudgetEdit'),
    title: selectSectionTitle(section),
    rateBank: bankState.get('rateBank').toJS(),
    history: bankState.get('history').toJS(),
    editedTableInputs: bankState.get('editedTableInputs'),
    sent: bankState.get('sent'),
    sending: bankState.get('sending'),
    editedBudgetInputs: bankState.get('editedBudgetInputs'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeEditTable: (toogleEdit) => { dispatch(changeEditTable(toogleEdit)); },
    changeEditBudget: (toogleEditB) => { dispatch(changeEditBadget(toogleEditB)); },
    getRateBank: (quoteType) => { dispatch(getRateBank(quoteType)); },
    getHistoryBank: (quoteType) => { dispatch(getHistoryBank(quoteType)); },
    sendToBank: (data) => { dispatch(sendToBank(data)); },
    changeSentBank: (sent) => { dispatch(changeSentBank(sent)); },
    saveTableData: (tableData) => { dispatch(saveTableData(tableData)); },
    saveBudgetData: (budgetData) => { dispatch(saveBudgetData(budgetData)); },
    editTableInput: (id, value) => { dispatch(editTableInput(id, value)); },
    editBudgetInput: (name, value) => { dispatch(editBudgetInput(name, value)); },
    tableUnmount: (tabledata) => { dispatch(rateBankSuccess(tabledata)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RateProduct);
