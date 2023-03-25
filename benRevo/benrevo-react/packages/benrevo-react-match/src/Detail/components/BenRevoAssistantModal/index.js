import { connect } from 'react-redux';
import { getMode, addNetwork, changeOptionNetwork } from '@benrevo/benrevo-react-quote';
import BenRevoAssistantModal from './BenRevoAssistantModal';
import { closeViolationModal } from './../../../actions';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;
  const clientsState = state.get('clients');
  const overviewState = state.get('presentation').get(section);
  const openedOption = overviewState.get('openedOption').toJS();
  const violationModalText = overviewState.get('violationModalText').toJS();
  const page = overviewState.get('page').toJS();
  return {
    openedOption,
    client: clientsState.get('current').toJS(),
    page,
    multiMode: getMode(overviewState.get('page').get('carrier').toJS()),
    violationMessage: violationModalText[openedOption.id],
    modalOpened: violationModalText[openedOption.id] ? violationModalText[openedOption.id].status : false,
    contributions: overviewState.get('openedOptionContributions').toJS() || [], // массив из карточек, total в каждом массиве - это и есть enroll
    section,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeViolationModal: (section, id) => { dispatch(closeViolationModal(section, id)); },
    addNetwork: (section, optionId, networkId, clientPlanId) => { dispatch(addNetwork(section, optionId, networkId, clientPlanId)); },
    changeOptionNetwork: (section, optionId, rfpQuoteNetworkId, rfpQuoteOptionNetworkId) => { dispatch(changeOptionNetwork(section, optionId, rfpQuoteNetworkId, rfpQuoteOptionNetworkId)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(BenRevoAssistantModal);

