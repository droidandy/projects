import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Admin } from '@benrevo/benrevo-react-core';
import SendToListHistory from './SendToListHistory';
import { getCarrierEmailsList, changeApproveCarrier, deleteEmailFromCarrier, saveEmails, saveCarrierEmailList } from './actions';

export class AdminPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    carrierEmailList: PropTypes.array.isRequired,
    getCarrierEmails: PropTypes.func.isRequired,
    changeApprove: PropTypes.func.isRequired,
    deleteEmail: PropTypes.func.isRequired,
    saveCarrierList: PropTypes.func.isRequired,
    saveEmailList: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    disclosure: PropTypes.object.isRequired,
  };

  render() {
    const {
      carrierEmailList,
      getCarrierEmails,
      changeApprove,
      deleteEmail,
      saveCarrierList,
      saveEmailList,
      loading,
      disclosure,
    } = this.props;

    return (
      <div className="admin-page-wrapper">
        <Admin />
        <SendToListHistory
          carrierEmailList={carrierEmailList}
          getCarrierEmails={getCarrierEmails}
          changeApprove={changeApprove}
          deleteEmail={deleteEmail}
          saveEmailList={saveEmailList}
          saveCarrierList={saveCarrierList}
          loading={loading}
          disclosure={disclosure}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const adminBrokerState = state.get('adminBroker');
  const adminPageState = state.get('adminPage');
  return {
    carrierEmailList: adminBrokerState.get('carrierEmailList').toJS(),
    disclosure: adminPageState.get('disclosure').toJS(),
    loading: adminBrokerState.get('loading'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCarrierEmails: () => { dispatch(getCarrierEmailsList()); },
    changeApprove: (value, carrierIndex) => { dispatch(changeApproveCarrier(value, carrierIndex)); },
    deleteEmail: (carrierIndex, emailIndex) => { dispatch(deleteEmailFromCarrier(carrierIndex, emailIndex)); },
    saveEmailList: (carrierIndex, emailList) => { dispatch(saveEmails(carrierIndex, emailList)); },
    saveCarrierList: () => { dispatch(saveCarrierEmailList()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);
