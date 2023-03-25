import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Grid, Header, Button, Icon, Dropdown, Message } from 'semantic-ui-react';
import { PERSON_SALES, PERSON_PRESALES, PERSON_MANAGER, PERSON_RENEWAL_MANAGER, PERSON_RENEWAL_SALES } from '../../constants';

const options = [
  { key: 's', text: 'SALES', value: PERSON_SALES },
  { key: 'p', text: 'PRESALES', value: PERSON_PRESALES },
  { key: 'm', text: 'MANAGER', value: PERSON_MANAGER },
  { key: 'rm', text: 'RENEWAL MANAGER', value: PERSON_RENEWAL_MANAGER },
  { key: 'rs', text: 'RENEWAL_SALES', value: PERSON_RENEWAL_SALES },
];

class EditPerson extends React.Component {
  static propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    modalClose: PropTypes.func.isRequired,
    person: PropTypes.object.isRequired,
    cancelClick: PropTypes.func.isRequired,
    handleSaveClick: PropTypes.func.isRequired,
    updatePerson: PropTypes.func.isRequired,
    allBrokerages: PropTypes.array.isRequired,
    fullBrokerageList: PropTypes.array.isRequired,
    allPeople: PropTypes.array.isRequired,
    updateChildren: PropTypes.func.isRequired,
    removeChildren: PropTypes.func.isRequired,
    currentChildren: PropTypes.array.isRequired,
    currentRole: PropTypes.string.isRequired,
  };

  constructor() {
    super();
    this.state = {
      data: '',
      numNewPeople: 0,
      numBrokerage: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.addBrokerage = this.addBrokerage.bind(this);
    this.addToChildren = this.addToChildren.bind(this);
    this.removeBrokerage = this.removeBrokerage.bind(this);
    this.removeFromChildren = this.removeFromChildren.bind(this);
    this.updateBrokerageName = this.updateBrokerageName.bind(this);
    this.updatePersonName = this.updatePersonName.bind(this);
    this.extractById = this.extractById.bind(this);
  }

  handleChange(value, type) {
    const { updatePerson, person } = this.props;
    // This next part updates fullName based on changes to firstName and lastName
    // Not sure if this is handled somewhere else already
    // Currently, this next part assumes that the fullName consists of the firstName
    // and lastName of a person separated by a single space, and that there are no
    // other spaces within a person's first or last names.
    if (type === 'firstName') {
      let fullNameList = person.fullName.split(' ');
      fullNameList[0] = value;
      fullNameList = fullNameList.join(' ');
      updatePerson('fullName', fullNameList);
    } else if (type === 'lastName') {
      let fullNameList = person.fullName.split(' ');
      fullNameList[1] = value;
      fullNameList = fullNameList.join(' ');
      updatePerson('fullName', fullNameList);
    }
    updatePerson(type, value);
  }

  addBrokerage() {
    const { updatePerson, person } = this.props;
    const newList = person.newBrokerageList;
    newList.push({});
    updatePerson('newBrokerageList', newList);
    const num = this.state.numBrokerage + 1;
    this.setState({ numBrokerage: num });
  }

  addToChildren() {
    const { currentChildren, updateChildren } = this.props;
    const newChild = { added: true };
    updateChildren(currentChildren.length, newChild);
    const num = this.state.numNewPeople + 1;
    this.setState({ numNewPeople: num });
  }

  removeFromChildren(index) {
    const { removeChildren } = this.props;
    removeChildren(index);
    const num = this.state.numNewPeople - 1;
    this.setState({ numNewPeople: num });
  }

  updatePersonName(value, index) {
    const list = this.state.peopleUnder;
    list[index].name = value;
    this.setState({ peopleUnder: list });
  }

  updateBrokerageName(id, index) {
    const { updatePerson, person, fullBrokerageList } = this.props;
    const value = this.extractById(id, fullBrokerageList);
    const list = person.newBrokerageList;
    const type = person.type.toLowerCase();
    value[`${type}Email`] = person.email;
    value[`${type}FirstName`] = person.firstName;
    value[`${type}LastName`] = person.lastName;
    list[index] = value;
    updatePerson('newBrokerageList', list);
    this.forceUpdate();
  }

  extractById(id, list) {
    for (let i = 0; i < list.length; i += 1) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  removeBrokerage(index) {
    const { updatePerson, person } = this.props;
    const list = person.newBrokerageList;
    list.splice(index, 1);
    updatePerson('newBrokerageList', list);
    const num = this.state.numBrokerage - 1;
    this.setState({ numBrokerage: num });
  }

  render() {
    const { updateChildren, currentChildren, cancelClick, allBrokerages, modalOpen, modalClose, person, handleSaveClick, allPeople, currentRole } = this.props;
    if (!person.type) {
      return null;
    }
    const personOptions = allPeople.map((currentPerson, index) =>
      ({ key: index, value: currentPerson.email, text: currentPerson.fullName })
    );
    const numChildren = currentChildren.filter((x) => !x.removed).length;
    let disabled = false;
    if (!(Object.keys(person).length === 0 && person.constructor === Object)) {
      if (!person.firstName || !person.lastName || !person.email || !person.type) disabled = true;
      if ((person.type.indexOf('MANAGER') !== -1) && currentChildren.length) {
        for (let i = 0; i < currentChildren.length; i += 1) {
          if (!currentChildren[i].personId) disabled = true;
        }
      }
      if ((person.type.indexOf('SALES') !== -1) && person.newBrokerageList.length) {
        for (let i = 0; i < person.newBrokerageList.length; i += 1) {
          if (!person.newBrokerageList[i].id) disabled = true;
        }
      }
      if ((person.type) !== currentRole && ((currentRole.indexOf('MANAGER') === -1 && person.brokerageList.length > 0) || (currentRole.indexOf('MANAGER') !== -1 && numChildren > 0))) disabled = true;
    }
    return (
      <Modal
        className="sales-modal"
        open={modalOpen}
        onClose={modalClose}
        closeOnDimmerClick={false}
        size={'small'}
        dimmer={false}
      >
        <Modal.Header>
          <a tabIndex="0" className="close-modal" onClick={() => { modalClose(); }}>X</a>
          <div className="header-main">
            <Header as="h2">Edit Personnel</Header>
          </div>
        </Modal.Header>
        <Modal.Content scrolling>
          <Grid>
            <Grid.Row>
              <Grid.Column width={5}>
                Personnel Information
              </Grid.Column>
              <Grid.Column width={10}>
                <Form>
                  <Form.Input label="First Name" fluid placeholder="First Name" defaultValue={person.firstName} onChange={(e) => this.handleChange(e.target.value, 'firstName')} />
                  <Form.Input label="Last Name" fluid placeholder="Last Name" defaultValue={person.lastName} onChange={(e) => this.handleChange(e.target.value, 'lastName')} />
                  <Form.Input label="Email" fluid placeholder="Email" defaultValue={person.email} onChange={(e) => this.handleChange(e.target.value, 'email')} />
                  <Form.Select upward search selection options={options} label="Type" fluid placeholder="Sales/Presales" value={person.type || ''} onChange={(e, inputState) => this.handleChange(inputState.value, 'type')} />
                </Form>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                { ((person.type) !== currentRole && ((person.brokerageList && person.brokerageList.length > 0) || (numChildren > 0))) &&
                  <Message warning>
                    <Message.Header>Affiliated Information Detected!</Message.Header>
                    <p>
                      In order to change this person&apos;s type to {person.type},
                      you must reassign all affiliated
                      { (person.brokerageList.length > 0) &&
                        ' brokerages'
                      }
                      { (person.brokerageList.length > 0) && (person.type.indexOf('MANAGER') === -1 && numChildren > 0) &&
                        ' and'
                      }
                      { person.type.indexOf('MANAGER') === -1 && (numChildren > 0) &&
                        ' personnel'
                      }
                      !
                    </p>
                  </Message>
                }
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              { person.brokerageList && person.brokerageList.length > 0 &&
                (<Grid.Column width={5}>
                  Current Brokerages
                </Grid.Column>)
              }
              {person.brokerageList && person.brokerageList.length > 0 &&
                <Grid.Column width={10}>
                  <Grid className="listBrokerages">
                    { person.brokerageList && person.brokerageList.length > 0 && person.brokerageList.map((brokerage, index) => (
                      <Grid.Row key={index}>
                        <Grid.Column width={16}>
                          {brokerage.name}
                        </Grid.Column>
                      </Grid.Row>
                    )) }
                  </Grid>
                </Grid.Column>
              }
              { ((currentRole.indexOf('MANAGER') !== -1 && currentRole === person.type) ||
                (person.type.indexOf('MANAGER') === -1 && numChildren > 0) ||
                (person.type.indexOf('MANAGER') !== -1)) &&
                (<Grid.Column width={5}>
                    Currently Manages
                </Grid.Column>)
              }
              { (((currentRole.indexOf('MANAGER') !== -1) && currentRole === person.type) ||
                (person.type.indexOf('MANAGER') === -1 && numChildren > 0) ||
                (person.type.indexOf('MANAGER') !== -1)) &&
                <Grid.Column width={10}>
                  <Grid className="listBrokerages">
                    { currentChildren && currentChildren.length > 0 && currentChildren.map((child, index) => (
                      !child.removed &&
                      (<Grid.Row key={index}>
                        <Grid.Column width={14}>
                          { !child.added && `${child.fullName} - (${child.type})` }
                          { child.added &&
                            <Dropdown upward search selection options={personOptions} fluid placeholder="select person" value={child.email} onChange={(e, inputState) => { updateChildren(index, inputState.value); }} />
                          }
                        </Grid.Column>
                        <Grid.Column width={2}>
                          <span className="brokerageRemove" onClick={() => { this.removeFromChildren(index); }}><Icon name="remove" /></span>
                        </Grid.Column>
                      </Grid.Row>)
                    )) }
                  </Grid>
                  { (person.type.indexOf('MANAGER') !== -1) &&
                    (<span className="button-add-another" onClick={(e) => { e.preventDefault(); this.addToChildren(); }}><Icon name={'add circle'} color={'blue'} />Add another person</span>)
                  }
                </Grid.Column>
              }
              <Grid.Column width={5}>
                { (person.type.indexOf('SALES') !== -1) &&
                'New Brokerages'
                }
              </Grid.Column>
              <Grid.Column width={10}>
                <Grid className="listBrokerages">
                  { (person.type.indexOf('SALES') !== -1) && person.newBrokerageList && person.newBrokerageList.length > 0 && person.newBrokerageList.map((brokerage, index) => (
                    <Grid.Row key={index}>
                      <Grid.Column width={14}>
                        <Dropdown upward search selection options={allBrokerages} fluid placeholder="Select Brokerage" value={brokerage.id || ''} onChange={(e, inputState) => this.updateBrokerageName(inputState.value, index)} />
                      </Grid.Column>
                      <Grid.Column>
                        <span className="brokerageRemove" onClick={() => { this.removeBrokerage(index); }}><Icon name="remove" /></span>
                      </Grid.Column>
                    </Grid.Row>
                  )) }
                  { (person.type.indexOf('SALES') !== -1) && this.state.peopleUnder && this.state.peopleUnder.length > 0 && this.state.peopleUnder.map((personUnder, index) => (
                    <Grid.Row key={index}>
                      <Grid.Column width={14}>
                        <Dropdown upward search selection options={personOptions} fluid placeholder="Select People" value={personUnder.value || ''} onChange={(e, inputState) => this.updatePersonName(inputState.value, index)} />
                      </Grid.Column>
                      <Grid.Column>
                        <span className="brokerageRemove" onClick={() => { this.removeFromPersons(index); }}><Icon name="remove" /></span>
                      </Grid.Column>
                    </Grid.Row>
                  )) }
                </Grid>
                { (person.type.indexOf('SALES') !== -1) &&
                  (<span className="button-add-another" onClick={(e) => { e.preventDefault(); this.addBrokerage(); }}><Icon name={'add circle'} color={'blue'} />Add another brokerage</span>)
                }
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <div className="buttons">
          <a tabIndex="0" className="cancel-button" onClick={() => { cancelClick(); }}>Cancel</a>
          <Button disabled={disabled} className="not-link-button" size="medium" primary onClick={handleSaveClick}>Save Changes</Button>
        </div>
      </Modal>
    );
  }
}

export default EditPerson;
