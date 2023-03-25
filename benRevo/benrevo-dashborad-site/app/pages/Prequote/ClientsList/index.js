import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { quoteNewClient } from '@benrevo/benrevo-react-clients';
import ClientsList from './ClientsList';
import { getPreQuoted, changePreQuotedSort } from './actions';
import {
  selectSortedNewRfps,
  selectSortedInProgress,
} from './selectors';
import { saveClient } from '../actions';

function mapStateToProps(state) {
  const qoutesState = state.get('preQuoted');
  const clientsState = state.get('clients');
  return {
    loading: qoutesState.get('loading'),
    NewRfps: selectSortedNewRfps(state),
    InProgress: selectSortedInProgress(state),
    sort: qoutesState.get('sort').toJS(),
    client: clientsState.get('current').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPreQuoted: () => { dispatch(getPreQuoted()); },
    changePreQuotedSort: (prop, order) => { dispatch(changePreQuotedSort(prop, order)); },
    saveClient: () => { dispatch(saveClient()); },
    quoteNewClient: () => { dispatch(quoteNewClient()); },
    redirect: (clientId) => {
      dispatch(push({ pathname: `/prequote/clients/${clientId}` }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientsList);
