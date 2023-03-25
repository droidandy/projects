import { connect } from 'react-redux';
import { getToken, BENREVO_API_PATH } from '@benrevo/benrevo-react-core';
import PreviewRfp from './PreviewRfp';
import { getPdf } from '../actions';
import { selectRfpSelected, selectSelected } from './../selectors';

function mapStateToProps(state) {
  const clientsState = state.get('clients');
  const clientId = clientsState.get('current').get('id');
  const hasClient = !!clientId;
  const rfpIds = selectRfpSelected()(state);
  return {
    client: clientsState.get('current').toJS(),
    url: (rfpIds.length) ? `${BENREVO_API_PATH}/v1/clients/${clientId}/rfps/all/pdf/?rfpIds=${rfpIds.join(',')}` : '',
    urlWord: `${BENREVO_API_PATH}/v1/clients/${clientId}/rfps/all/docx/?rfpIds=${rfpIds.join(',')}`,
    hasClient,
    selected: selectSelected(state),
    token: getToken(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPdf: () => { dispatch(getPdf()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PreviewRfp);
