import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  Presentation,
} from '@benrevo/benrevo-react-quote';
import { Grid, Header } from 'semantic-ui-react';
import Options from './components/Options';
import Activity from './components/Activity';
import History from './components/History';
import { getInitials, getDate } from '../../../utils/query';
import { ACCESS_STATUS_START, ACCESS_STATUS_STOP } from './constants';
import NavigationPresentation from '../NavigationPresentation';
import * as appTypes from '../../App/constants';

class Details extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    clientId: PropTypes.string.isRequired,
    optionsProduct: PropTypes.string.isRequired,
    accessStatus: PropTypes.string.isRequired,
    client: PropTypes.object.isRequired,
    currentActivity: PropTypes.object.isRequired,
    mainCarrier: PropTypes.object.isRequired,
    optionDetails: PropTypes.object.isRequired,
    optionRiders: PropTypes.object.isRequired,
    sort: PropTypes.object.isRequired,
    productsList: PropTypes.array.isRequired,
    carriersList: PropTypes.object.isRequired,
    activities: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    getClients: PropTypes.func.isRequired,
    getOption: PropTypes.func.isRequired,
    getActivity: PropTypes.func.isRequired,
    getActivityByType: PropTypes.func.isRequired,
    getActivities: PropTypes.func.isRequired,
    changeOptionsProduct: PropTypes.func.isRequired,
    changeActivitySort: PropTypes.func.isRequired,
    changeActivity: PropTypes.func.isRequired,
    updateActivity: PropTypes.func.isRequired,
    createActivity: PropTypes.func.isRequired,
    removeActivity: PropTypes.func.isRequired,
    changeAccessStatus: PropTypes.func.isRequired,
    clients: PropTypes.array.isRequired,
    role: PropTypes.array.isRequired,
    historyNotes: PropTypes.string.isRequired,
    historyEdits: PropTypes.string.isRequired,
    historyEditMode: PropTypes.bool.isRequired,
    toggleHistoryEditMode: PropTypes.func.isRequired,
    updateHistoryText: PropTypes.func.isRequired,
    historySaveLoading: PropTypes.bool.isRequired,
    saveHistoryUpdates: PropTypes.func.isRequired,
    getHistoryNotes: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { changeOptionsProduct, clientId, getActivities, getClients, clients, accessStatus, getHistoryNotes } = this.props;
    if (!clients.length) getClients();
    if (accessStatus === ACCESS_STATUS_STOP) {
      changeOptionsProduct(clientId, appTypes.MEDICAL_SECTION.toUpperCase());
      getActivities(clientId);
      getHistoryNotes(clientId);
    }
  }

  render() {
    const {
      client,
      productsList,
      optionsProduct,
      changeOptionsProduct,
      activities,
      clients,
      currentActivity,
      carriersList,
      changeAccessStatus,
      mainCarrier,
      accessStatus,
      clientId,
      role,
      historyNotes,
      historyEdits,
      historyEditMode,
      toggleHistoryEditMode,
      updateHistoryText,
      historySaveLoading,
      saveHistoryUpdates,
      getHistoryNotes,
      loading,
    } = this.props;
    const checkAccess = client.clientId && client.clientId.toString() === clientId;
    if (client.clientId) {
      return (
        <div className="clients-details">
          { accessStatus === ACCESS_STATUS_START && checkAccess && <NavigationPresentation clientId={clientId} /> }
          { accessStatus === ACCESS_STATUS_START && checkAccess && <Presentation {...this.props} hideNav /> }
          { accessStatus === ACCESS_STATUS_STOP &&
            <Link className="back-button" to="/clients">{'<'} Back to All Clients</Link>
          }
          { accessStatus === ACCESS_STATUS_STOP &&
          <Header className="client-page-title">
            <Grid className="client-info">
              <Grid.Row>
                <Grid.Column computer="5" tablet="5" mobile="16">
                  <span className="client-initials">{getInitials(client.clientName)}</span>
                  <span className="client-name">{client.clientName}</span>
                </Grid.Column>
                <Grid.Column computer="6" tablet="6" mobile="8" verticalAlign="middle">
                  <div className="client-info-title"><span>Brokerage:</span> {client.brokerName || '-'}</div>
                  { client.gaName && <div className="client-info-title"><span>GA:</span> {client.gaName || '-'}</div> }
                  <div className="client-info-title"><span>SAE:</span> {client.salesName || '-'}</div>
                </Grid.Column>
                <Grid.Column computer="5" tablet="5" mobile="8" floated="right" className="client-info-last" verticalAlign="middle">
                  <div className="client-info-title"><span>Employees:</span> {client.employeeCount || '-'}</div>
                  <div className="client-info-title"><span>Date Uploaded:</span> {(client.dateUploaded) ? getDate(client.dateUploaded, 'MM.DD.YYYY') : '-'}</div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Header>
          }
          { accessStatus === ACCESS_STATUS_STOP &&
          <Grid>
            <Grid.Row>
              <Grid.Column width="16">
                <Options
                  loading={loading}
                  client={client}
                  clients={clients}
                  productsList={productsList}
                  optionsProduct={optionsProduct}
                  changeOptionsProduct={changeOptionsProduct}
                  getOption={this.props.getOption}
                  optionDetails={this.props.optionDetails}
                  optionRiders={this.props.optionRiders}
                  changeAccessStatus={changeAccessStatus}
                  role={role}
                />
                <Activity
                  activities={activities}
                  mainCarrier={mainCarrier}
                  productsList={productsList}
                  carriersList={carriersList}
                  currentActivity={currentActivity}
                  changeActivitySort={this.props.changeActivitySort}
                  sort={this.props.sort}
                  getActivity={this.props.getActivity}
                  getActivityByType={this.props.getActivityByType}
                  changeActivity={this.props.changeActivity}
                  updateActivity={this.props.updateActivity}
                  createActivity={this.props.createActivity}
                  removeActivity={this.props.removeActivity}
                />
                <History
                  historyData={historyNotes}
                  historyEdits={historyEdits}
                  isInEditMode={historyEditMode}
                  toggleEditMode={toggleHistoryEditMode}
                  updateHistoryText={updateHistoryText}
                  loading={historySaveLoading}
                  save={saveHistoryUpdates}
                  getHistoryNotes={getHistoryNotes}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          }
        </div>
      );
    }

    return (
      <div className="clients-details">
        <Link className="back-button" to="/clients">{'<'} Back to All Clients</Link>
      </div>
    );
  }
}

export default Details;
