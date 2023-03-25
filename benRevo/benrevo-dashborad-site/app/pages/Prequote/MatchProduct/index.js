import { connect } from 'react-redux';
import { changeCurrentPage, getOptions } from '@benrevo/benrevo-react-quote';
import MatchProduct from './MatchProduct';
import { KAISER_SECTION, MEDICAL_SECTION } from '../constants';
import { createClientPlans } from '../actions';
import { selectRFPIds } from '../selectors';

function mapStateToProps(state, ownProps) {
  let section = ownProps.routes[5].path;
  let quoteType = 'STANDARD';
  if (section === KAISER_SECTION) {
    section = MEDICAL_SECTION;
    quoteType = KAISER_SECTION;
  }
  const overviewState = state.get('presentation').get(section);
  const appState = state.get('app');
  const clientsState = state.get('clients');
  const raterState = state.get('rfp').get('rater');
  const matchState = state.get('rfp').get('match');

  return {
    section,
    quoteType,
    rfpIds: selectRFPIds(state),
    creatingPlans: matchState.get('creatingPlans'),
    options: overviewState.get('options').toJS(),
    mainCarrier: appState.get('mainCarrier').toJS(),
    loadingOptions: overviewState.get('loadingOptions'),
    page: overviewState.get('page').toJS(),
    client: clientsState.get('current').toJS(),
    carriersList: state.get('app').get('rfpcarriers').get(section).toJS(),
    history: raterState.get('history').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createClientPlans: (section, rfpIds) => { dispatch(createClientPlans(section, rfpIds)); },
    getOptions: (section) => { dispatch(getOptions(section)); },
    changeCurrentPage: (section, page) => { dispatch(changeCurrentPage(section, page)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchProduct);
