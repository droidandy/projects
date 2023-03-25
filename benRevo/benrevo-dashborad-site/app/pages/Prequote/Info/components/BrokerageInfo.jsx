import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Header,
  Form,
  Input,
  Dropdown,
  Button,
  Radio,
} from 'semantic-ui-react';
import { CHANGE_BROKER_RECORD } from '@benrevo/benrevo-react-rfp';
import { MEDICAL_SECTION, DENTAL_SECTION, VISION_SECTION } from '../../constants';
import BrokerageAccordion from './BrokerageAccordion';
import BrokerAccordion from './BrokerAccordion';

class BrokerageInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    updateClient: PropTypes.func.isRequired,
    setSelectedBroker: PropTypes.func.isRequired,
    getBrokerTeam: PropTypes.func.isRequired,
    // filterBrokerTeam: PropTypes.func.isRequired,
    selectBrokerTeamMember: PropTypes.func.isRequired,
    changeNewBroker: PropTypes.func.isRequired,
    setProducerValue: PropTypes.func.isRequired,
    brokerages: PropTypes.array.isRequired,
    selectedBC: PropTypes.array.isRequired,
    selectedGAC: PropTypes.array.isRequired,
    newBrokerContacts: PropTypes.array.isRequired,
    newGAContacts: PropTypes.array.isRequired,
    filteredbrokerContacts: PropTypes.array.isRequired,
    filteredGAContacts: PropTypes.array.isRequired,
    GA: PropTypes.array.isRequired,
    selectedBroker: PropTypes.object,
    newBroker: PropTypes.object.isRequired,
    selectedGA: PropTypes.object,
    resetSelectedGA: PropTypes.func.isRequired,
    updateForm: PropTypes.func.isRequired,
    setReadyToSave: PropTypes.func.isRequired,
    addBrokerContactsField: PropTypes.func.isRequired,
    removeBrokerContactsField: PropTypes.func.isRequired,
    updateBrokerContactsFields: PropTypes.func.isRequired,
    removeMemberFromSelectedList: PropTypes.func.isRequired,
    getBrokerage: PropTypes.func.isRequired,
    getClientTeam: PropTypes.func.isRequired,
    addNewContactField: PropTypes.func.isRequired,
    setSelectedBrokerTeam: PropTypes.func.isRequired,
    brokerOfRecord: PropTypes.string.isRequired,
    producer: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
  };
  state = {
    brokerContactsFields: [],
    GAContactsFields: [],
    GAContacts: [],
  };

  componentWillMount() {
    const { selectedBC, selectedGAC, getClientTeam, setSelectedBrokerTeam } = this.props;
    getClientTeam();
    const GADefaultContacts = this.props.client.clientMembers.filter((client) => client.generalAgent);
    const brokerDefaultContacts = this.props.client.clientMembers.filter((client) => !client.generalAgent);
    this.setState({
      GAContactsFields: Array.from({ length: GADefaultContacts.length - 1 }),
      brokerContactsFields: Array.from({ length: brokerDefaultContacts.length - 1 }),
    });
    const GAcontactsList = GADefaultContacts.length ? GADefaultContacts : [{}];
    setSelectedBrokerTeam(GAcontactsList, 'selectedGAC');
    setSelectedBrokerTeam(brokerDefaultContacts, 'selectedBC');
  }

  componentWillReceiveProps(nextProps) {
    const { selectedBC: thisSelectedBC, selectedGAC: thisSelectedGAC, client: thisClient, setSelectedBrokerTeam, getClientTeam } = this.props;
    const { selectedBC: nextSelectedBC, selectedGAC: nextSelectedGAC, client: nextClient } = nextProps;
    if (thisClient.id !== nextClient.id) {
      getClientTeam();
    }
    if (thisClient.clientMembers && thisClient.clientMembers.length !== nextClient.clientMembers.length) {
      const GADefaultContacts = nextClient.clientMembers.filter((client) => client.generalAgent);
      const brokerDefaultContacts = nextClient.clientMembers.filter((client) => !client.generalAgent);
      this.setState({
        GAContactsFields: Array.from({ length: GADefaultContacts.length - 1 }),
        brokerContactsFields: Array.from({ length: brokerDefaultContacts.length - 1 }),
      });
      setSelectedBrokerTeam(GADefaultContacts, 'selectedGAC');
      setSelectedBrokerTeam(brokerDefaultContacts, 'selectedBC');
    }
    if (thisSelectedBC.length !== nextSelectedBC.length || thisSelectedGAC.length !== nextSelectedGAC.length) {
      this.setState({
        brokerContactsFields: Array.from({ length: nextSelectedBC.length - 1 }),
        GAContactsFields: Array.from({ length: nextSelectedGAC.length - 1 }),
      });
    }
    if (thisClient.brokerId && thisClient.brokerId !== nextClient.brokerId) {
      this.props.getBrokerage();
    }
  }

  setGAContactsOptions = () => {
    const { GA } = this.props;
    const options = [{
      text: 'No General Agent',
      value: null,
    }];
    GA.map((agent) => {
      options.push({
        text: agent.name,
        value: agent.id,
      });
    });
    return options;
  };

  removeField = (fieldType, selected, contactsType, filterType, index) => {
    const { removeMemberFromSelectedList } = this.props;
    const fields = [...this.state[fieldType]];
    this.setState({
      [fieldType]: fields.filter((el, i) => i !== index),
    });
    if (!this.props[selected][index]) {
      return;
    }
    removeMemberFromSelectedList(index, selected, filterType);
    // filterBrokerTeam(selected, contactsType, filterType);
  };

  addNewField = (type, contactsType) => {
    const { addNewContactField } = this.props;
    const fields = [...this.state[type]];
    fields.push({ value: false });
    this.setState({
      [type]: fields,
    });
    addNewContactField(contactsType);
    // filterBrokerTeam(selected, contactsType, filterType);
  }


  handleDropdownChange = (e, data, type, contactsType) => {
    const { getBrokerTeam, setSelectedBroker, updateClient, resetSelectedGA } = this.props;
    const idType = type === 'brokerages' ? 'brokerId' : 'gaId';
    if (!data.value) {
      updateClient(idType, null);
      resetSelectedGA();
      return;
    }
    const list = [...this.props[type]];
    const selectedItem = list.filter((listItem) => listItem.id === data.value);
    const brokerType = type === 'brokerages' ? 'selectedBroker' : 'selectedGA';
    setSelectedBroker(selectedItem[0], brokerType, contactsType);
    updateClient(idType, selectedItem[0].id);
    getBrokerTeam(selectedItem[0].id, contactsType);
  };

  handleBrokerContactsChange = (e, data, index, selected, contactsType) => {
    const { selectBrokerTeamMember } = this.props;
    selectBrokerTeamMember(data.value, selected, contactsType, index);
    // filterBrokerTeam(selected, contactsType, filterType);
  };

  handleProducerChange = (e, inputState) => {
    this.props.setProducerValue(inputState.value);
  }

  handleChange = (e, { value }) => this.setState({ value });

  changeBrokerRecord(value) {
    const { updateForm } = this.props;
    updateForm(MEDICAL_SECTION, CHANGE_BROKER_RECORD, value);
    updateForm(DENTAL_SECTION, CHANGE_BROKER_RECORD, value);
    updateForm(VISION_SECTION, CHANGE_BROKER_RECORD, value);
  }

  render() {
    const { brokerContactsFields, GAContactsFields } = this.state;
    const {
      brokerages,
      selectedBroker,
      selectedGA,
      selectedBC,
      selectedGAC,
      filteredbrokerContacts,
      filteredGAContacts,
      changeNewBroker,
      addBrokerContactsField,
      removeBrokerContactsField,
      updateBrokerContactsFields,
      brokerOfRecord,
      newBrokerContacts,
      newGAContacts,
      newBroker,
      producer,
      setReadyToSave,
    } = this.props;

    return (
      <Fragment>
        <Grid.Row>
          <Grid.Column width={16} >
            <Header as="h3" className="title2" onClick={this.setGAContactsOptions}>BROKERAGE INFO</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={6} >
          </Grid.Column>
          <Grid.Column width={10} >
            <Form.Field inline >
              <Header as="h4" className="title-form">Select Brokerage</Header>
              <Dropdown
                search
                fluid
                selection
                placeholder="Select your broker"
                value={selectedBroker ? selectedBroker.id : ''}
                onChange={(e, data) => this.handleDropdownChange(e, data, 'brokerages', 'brokerContacts')}
                options={brokerages.map((brokerage) => (
                  {
                    text: brokerage.name,
                    value: brokerage.id,
                  }
                ))}
              />
              {
                selectedBroker &&
                <div className="selected-broker">
                  <div>{selectedBroker.name}</div>
                  <div>{selectedBroker.address}</div>
                  <div>{`${selectedBroker.city}, ${selectedBroker.state} ${selectedBroker.zip}`}</div>
                </div>
              }
              <Header as="h4" className="title-form">Don&apos;t see your brokerage in the list?</Header>
              <BrokerageAccordion
                changeNewBroker={changeNewBroker}
                setReadyToSave={setReadyToSave}
                newBroker={newBroker}
              />
              <Header as="h4" className="title-form header-bordered">Co-Brokerage/Producer Name</Header>
              <Form.Field>
                <Input
                  fluid
                  name="producer"
                  value={selectedBroker && selectedBroker.producer ? selectedBroker.producer : producer.name}
                  onChange={this.handleProducerChange}
                />
              </Form.Field>
              <Header as="h4" className="title-form header-bordered">Broker Contact&#40;s&#41;</Header>
              <Dropdown
                fluid
                placeholder="Select your contact" search selection
                value={selectedBC[0] ? selectedBC[0].authId : ''}
                text={selectedBC[0] ? selectedBC[0].fullName : ''}
                onChange={(e, data) => this.handleBrokerContactsChange(e, data, 0, 'selectedBC', 'brokerContacts', 'filteredbrokerContacts')}
                options={filteredbrokerContacts.map((contact) => (
                  {
                    text: contact.fullName,
                    value: contact.authId,
                  }
                ))}
              />
              {
                brokerContactsFields.map((el, i) => (
                  <div key={i} className="contacts-holder">
                    <Dropdown
                      fluid
                      placeholder="Select your contact"
                      search
                      selection
                      value={selectedBC[i + 1] ? selectedBC[i + 1].authId : ''}
                      text={selectedBC[i + 1] ? selectedBC[i + 1].fullName : ''}
                      onChange={(e, data) => this.handleBrokerContactsChange(e, data, i + 1, 'selectedBC', 'brokerContacts', 'filteredbrokerContacts')}
                      options={filteredbrokerContacts.map((contact) => (
                        {
                          text: contact.fullName,
                          value: contact.authId,
                        }
                      ))}
                    />
                    <Button className="del-button" onClick={() => this.removeField('brokerContactsFields', 'selectedBC', 'brokerContacts', 'filteredbrokerContacts', i + 1)}>X</Button>
                  </div>
                ))
              }
              {
                filteredbrokerContacts.length > 0 &&
                <Button onClick={() => this.addNewField('brokerContactsFields', 'selectedBC', 'brokerContacts', 'filteredbrokerContacts')} className="add-field">ADD ANOTHER</Button>
              }
              <Header as="h4" className="title-form">Don&apos;t see your brokerage in the list?</Header>
              <BrokerAccordion
                contactType={'newBrokerContacts'}
                newBrokerContacts={newBrokerContacts}
                brokerId={selectedBroker && selectedBroker.id}
                addBrokerContactsField={addBrokerContactsField}
                removeBrokerContactsField={removeBrokerContactsField}
                updateBrokerContactsFields={updateBrokerContactsFields}
              />
              <Header as="h4" className="title-form header-bordered">Broker of Record</Header>
              <Form className="radio-holder">
                <Form.Field>
                  <Radio
                    label="Yes"
                    name="brokerRecord"
                    value="yes"
                    checked={brokerOfRecord === 'yes'}
                    onChange={(e, inputState) => {
                      this.changeBrokerRecord(inputState.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label="No"
                    name="brokerRecord"
                    value="no"
                    checked={brokerOfRecord === 'no'}
                    onChange={(e, inputState) => {
                      this.changeBrokerRecord(inputState.value);
                    }}
                  />
                </Form.Field>
              </Form>
              <Grid.Row>
                <div className="general-agent-holder">
                  <Header as="h4" className="side-title title-form">General Agent Information</Header>
                </div>
                <Grid.Column width={10} >
                  <Header className="title-form" as="h4">General Agent</Header>
                  <Dropdown
                    placeholder="Select your GA"
                    search
                    fluid
                    selection
                    value={selectedGA ? selectedGA.id : ''}
                    onChange={(e, data) => this.handleDropdownChange(e, data, 'GA', 'GAContacts')}
                    options={this.setGAContactsOptions()}
                  />
                  {
                    selectedGA &&
                    <div className="selected-broker">
                      <div>{selectedGA.name}</div>
                      <div>{selectedGA.address}</div>
                      <div>{`${selectedGA.city}, ${selectedGA.state} ${selectedGA.zip}`}</div>
                    </div>
                  }
                  <Header className="title-form header-bordered" as="h4">GA Contact&#40;s&#41;</Header>

                  <div className="contacts-holder">
                    <Dropdown
                      fluid
                      placeholder="Select your contact" search selection
                      value={selectedGAC[0] ? selectedGAC[0].authId : ''}
                      text={selectedGAC[0] ? selectedGAC[0].fullName : ''}
                      onChange={(e, data) => this.handleBrokerContactsChange(e, data, 0, 'selectedGAC', 'GAContacts', 'filteredGAContacts')}
                      options={filteredGAContacts.map((contact) => (
                        {
                          text: contact.fullName,
                          value: contact.authId,
                        }
                      ))}
                    />
                    <Button className="del-button" onClick={() => this.removeField('GAContactsFields', 'selectedGAC', 'GAContacts', 'filteredGAContacts', 0)}>X</Button>
                  </div>
                  {
                    GAContactsFields.map((el, i) => (
                      <div key={i} className="contacts-holder">
                        <Dropdown
                          fluid
                          placeholder="Select your contact"
                          search
                          selection
                          value={selectedGAC[i + 1] ? selectedGAC[i + 1].authId : ''}
                          text={selectedGAC[i + 1] ? selectedGAC[i + 1].fullName : ''}
                          onChange={(e, data) => this.handleBrokerContactsChange(e, data, i + 1, 'selectedGAC', 'GAContacts', 'filteredGAContacts')}
                          options={filteredGAContacts.map((contact) => (
                            {
                              text: contact.fullName,
                              value: contact.authId,
                            }
                          ))}
                        />
                        <Button className="del-button" onClick={() => this.removeField('GAContactsFields', 'selectedGAC', 'GAContacts', 'filteredGAContacts', i + 1)}>X</Button>
                      </div>
                    ))
                  }
                  {
                    filteredGAContacts.length > 0 &&
                    <Button onClick={() => this.addNewField('GAContactsFields', 'selectedGAC', 'GAContacts', 'filteredbrokerContacts')} className="add-field">ADD ANOTHER</Button>
                  }
                  <Header as="h4" className="title-form">Don&apos;t see your GA contact in the list?</Header>
                  <BrokerAccordion
                    contactType="newGAContacts"
                    newGAContacts={newGAContacts}
                    brokerId={selectedGA && selectedGA.id}
                    addBrokerContactsField={addBrokerContactsField}
                    removeBrokerContactsField={removeBrokerContactsField}
                    updateBrokerContactsFields={updateBrokerContactsFields}
                  />
                </Grid.Column>
              </Grid.Row>
            </Form.Field>
          </Grid.Column>
        </Grid.Row>
      </Fragment>
    );
  }
}

export default BrokerageInfo;
