import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Grid, Dimmer, Loader, Segment, Header, Table, Button, Input, Form } from 'semantic-ui-react';
import EditPerson from './components/EditPerson';
import DeleteConfirmation from './components/DeleteConfirmation';
import { PERSON_RENEWAL_MANAGER } from '../constants';

class Persons extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    saving: PropTypes.bool.isRequired,
    brokerages: PropTypes.array.isRequired,
    fullBrokerageList: PropTypes.array.isRequired,
    personOfInterest: PropTypes.object.isRequired,
    personnelList: PropTypes.array.isRequired,
    currentChildren: PropTypes.array.isRequired,
    fullPersonnelList: PropTypes.array.isRequired,
    cancelPerson: PropTypes.func.isRequired,
    newPOI: PropTypes.func.isRequired,
    savePersons: PropTypes.func.isRequired,
    updatePerson: PropTypes.func.isRequired,
    updateSearchText: PropTypes.func.isRequired,
    searchText: PropTypes.string.isRequired,
    updateChildren: PropTypes.func.isRequired,
    removeChildren: PropTypes.func.isRequired,
    POICurrentRole: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      editModalOpen: false,
      deleteModalOpen: false,
    };

    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handlePencilClick = this.handlePencilClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.onSearchInputChange = this.onSearchInputChange.bind(this);
    this.closeModals = this.closeModals.bind(this);
    this.promptConfirmation = this.promptConfirmation.bind(this);
  }

  onSearchInputChange(e) {
    const { updateSearchText } = this.props;
    updateSearchText(e.target.value.toLowerCase());
  }

  closeModals() {
    this.setState({ editModalOpen: false, deleteModalOpen: false });
  }

  handlePencilClick(person) {
    const { newPOI } = this.props;
    newPOI(person, 'edit');
    this.setState({ editModalOpen: true });
  }

  handleSaveClick() {
    const { savePersons } = this.props;
    savePersons();
    this.closeModals();
  }

  promptConfirmation(person) {
    const { newPOI } = this.props;
    newPOI(person, 'delete');
    this.setState({ deleteModalOpen: true });
  }

  handleDeleteClick() {
    const { savePersons } = this.props;
    savePersons();
    this.closeModals();
  }

  handleCancelClick() {
    const { cancelPerson } = this.props;
    cancelPerson();
    this.closeModals();
  }

  render() {
    const { POICurrentRole, fullPersonnelList, removeChildren, updateChildren, currentChildren, personOfInterest, fullBrokerageList, brokerages, loading, updatePerson, searchText, personnelList, saving } = this.props;
    return (
      <div className="persons">
        <Helmet
          title="Sales/Presales - List"
          meta={[
            { name: 'description', content: 'Sales/Presales - List' },
          ]}
        />
        <Grid stackable as={Segment} className="gridSegment">
          <Grid.Row className="header-main">
            <Grid.Column>
              <Header as="h2">List</Header>
              <div className="divider" />
              <Form className="search-personnel-form">
                <Input icon="search" iconPosition="left" placeholder="Search for personnel" value={searchText} type="text" fluid onChange={this.onSearchInputChange} />
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="table-row">
            <Dimmer active={loading && (!personnelList.length)} inverted>
              <Loader indeterminate size="big">Getting sales and presales</Loader>
            </Dimmer>
            <Dimmer active={saving} inverted>
              <Loader indeterminate size="big">Saving Changes</Loader>
            </Dimmer>
            { !loading && (personnelList.length) &&
              <Table className="data-table" unstackable>
                <Table.Header>
                  <Table.Row className="data-table-head">
                    <Table.HeaderCell width="4">Name</Table.HeaderCell>
                    <Table.HeaderCell width="5">Email</Table.HeaderCell>
                    <Table.HeaderCell width="2">Type</Table.HeaderCell>
                    <Table.HeaderCell width="3" />
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  { personnelList.map((person) => (
                    <Table.Row key={person.personId}>
                      <Table.Cell>{`${person.firstName} ${person.lastName}`}</Table.Cell>
                      <Table.Cell>{person.email}</Table.Cell>
                      <Table.Cell>{person.type === PERSON_RENEWAL_MANAGER ? 'RENEWAL_MANAGER' : person.type}</Table.Cell>
                      <Table.Cell>
                        <Button className="edit-button" primary size="tiny" onClick={() => this.handlePencilClick(person)}>Edit</Button>
                        <Button className="remove-button" onClick={() => this.promptConfirmation(person)}>X</Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            }
          </Grid.Row>
        </Grid>
        <EditPerson
          allBrokerages={brokerages}
          fullBrokerageList={fullBrokerageList}
          updatePerson={updatePerson}
          cancelClick={this.handleCancelClick}
          handleSaveClick={this.handleSaveClick}
          modalOpen={this.state.editModalOpen}
          modalClose={this.closeModals}
          person={personOfInterest}
          currentRole={POICurrentRole}
          allPeople={fullPersonnelList}
          currentChildren={currentChildren}
          updateChildren={updateChildren}
          removeChildren={removeChildren}
        />
        <DeleteConfirmation person={this.props.personOfInterest} handleDeleteClick={this.handleDeleteClick} modalOpen={this.state.deleteModalOpen} modalClose={this.handleCancelClick} />
      </div>
    );
  }
}

export default Persons;
