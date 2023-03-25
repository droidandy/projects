import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Header,
} from 'semantic-ui-react';
import ClientsInfo from './components/ClientsInfo';
import BrokerageInfo from './components/BrokerageInfo';

class Info extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    updateClient: PropTypes.func.isRequired,
    getBrokerTeam: PropTypes.func.isRequired,
    removeMemberFromSelectedList: PropTypes.func.isRequired,
    addBrokerContactsField: PropTypes.func.isRequired,
    removeBrokerContactsField: PropTypes.func.isRequired,
    updateBrokerContactsFields: PropTypes.func.isRequired,
    setSelectedBroker: PropTypes.func.isRequired,
    changeNewBroker: PropTypes.func.isRequired,
    filterBrokerTeam: PropTypes.func.isRequired,
    selectBrokerTeamMember: PropTypes.func.isRequired,
    updateForm: PropTypes.func.isRequired,
    setReadyToSave: PropTypes.func.isRequired,
    setProducerValue: PropTypes.func.isRequired,
    resetSelectedGA: PropTypes.func.isRequired,
    getBrokerage: PropTypes.func.isRequired,
    getClientTeam: PropTypes.func.isRequired,
    setSelectedBrokerTeam: PropTypes.func.isRequired,
    addNewContactField: PropTypes.func.isRequired,
    clientInfo: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    brokerOfRecord: PropTypes.string.isRequired,
  };

  render() {
    const {
      updateClient,
      getBrokerTeam,
      filterBrokerTeam,
      selectBrokerTeamMember,
      removeMemberFromSelectedList,
      addBrokerContactsField,
      removeBrokerContactsField,
      updateBrokerContactsFields,
      changeNewBroker,
      setSelectedBroker,
      resetSelectedGA,
      client,
      brokerOfRecord,
      updateForm,
      setReadyToSave,
      setProducerValue,
      getBrokerage,
      setSelectedBrokerTeam,
      getClientTeam,
      addNewContactField,
      clientInfo: {
        brokerages,
        selectedBroker,
        selectedGA,
        GA,
        brokerContacts,
        GAContacts,
        filteredbrokerContacts,
        filteredGAContacts,
        selectedBC,
        selectedGAC,
        newBrokerContacts,
        newGAContacts,
        newBroker,
        producer,
      },
    } = this.props;
    return (
      <Grid className="prequote-info">
        <Grid.Row>
          <Grid.Column width={16} textAlign="center">
            <Header as="h1" className="title1">Client Information</Header>
            <div className="title1-description">
              Let{'\''}s go over everything you need to get a quote for your client
            </div>
          </Grid.Column>
        </Grid.Row>
        <ClientsInfo
          client={client}
          updateClient={updateClient}
        />
        <BrokerageInfo
          updateClient={updateClient}
          brokerages={brokerages}
          brokerContacts={brokerContacts}
          GAContacts={GAContacts}
          getBrokerTeam={getBrokerTeam}
          filteredbrokerContacts={filteredbrokerContacts}
          filteredGAContacts={filteredGAContacts}
          filterBrokerTeam={filterBrokerTeam}
          selectBrokerTeamMember={selectBrokerTeamMember}
          removeMemberFromSelectedList={removeMemberFromSelectedList}
          selectedBC={selectedBC}
          selectedGAC={selectedGAC}
          GA={GA}
          brokerOfRecord={brokerOfRecord}
          changeNewBroker={changeNewBroker}
          addBrokerContactsField={addBrokerContactsField}
          removeBrokerContactsField={removeBrokerContactsField}
          updateBrokerContactsFields={updateBrokerContactsFields}
          setSelectedBroker={setSelectedBroker}
          selectedBroker={selectedBroker}
          selectedGA={selectedGA}
          resetSelectedGA={resetSelectedGA}
          updateForm={updateForm}
          newBrokerContacts={newBrokerContacts}
          newGAContacts={newGAContacts}
          setReadyToSave={setReadyToSave}
          newBroker={newBroker}
          setProducerValue={setProducerValue}
          producer={producer}
          client={client}
          getBrokerage={getBrokerage}
          setSelectedBrokerTeam={setSelectedBrokerTeam}
          getClientTeam={getClientTeam}
          addNewContactField={addNewContactField}
        />
      </Grid>
    );
  }
}

export default Info;
