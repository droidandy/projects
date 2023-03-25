import { connect } from 'react-redux';
import { replace, push } from 'react-router-redux';
import { sendRfp, changeShowErrors } from '@benrevo/benrevo-react-rfp';
import { saveClient } from '../actions';
import Section from './Section';

function mapStateToProps(state, ownProps) {
  const clientsState = state.get('clients');
  const section = ownProps.route.path;
  const clientId = ownProps.params.clientId;
  const commonState = state.get('rfp').get('common');
  const infoState = state.get('rfp').get(section);
  const rfpState = state.get('rfp');

  return {
    client: clientsState.get('current').toJS(),
    clientId,
    routes: [
      ownProps.routes[0],
      ownProps.routes[3],
      ownProps.routes[4],
      ownProps.routes[5],
    ],
    products: clientsState.get('current').get('products').toJS(),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    clientSaveInProgress: rfpState.get('clientInfo').get('clientSaveInProgress'),
    section,
    prefix: `prequote/clients/${clientId || 'new'}`,
    showErrors: commonState.get('showErrors'),
    formErrors: (infoState && infoState.get('formErrors')) ? infoState.get('formErrors').toJS() : {},
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sendRfp: (payload) => { dispatch(sendRfp(payload)); },
    saveClient: () => { dispatch(saveClient()); },
    redirect: (clientId) => {
      dispatch(replace({ pathname: `/prequote/clients/${clientId}/client/products` }));
    },
    changePage: (page, prefix) => {
      dispatch(push(`${prefix || ''}/${page}`));
    },
    changeShowErrors: (value) => { dispatch(changeShowErrors(value)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
