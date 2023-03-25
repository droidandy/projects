import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Grid, Segment, Header, Table, Button, Icon, Loader, Form } from 'semantic-ui-react';

const options = [
  { key: 's', text: 'SALES', value: 'Sales' },
  { key: 'p', text: 'PRESALES', value: 'PreSales' },
  { key: 'm', text: 'MANAGER', value: 'Carrier_Manager' },
  { key: 'sr', text: 'SALES RENEWAL', value: 'Sales_Renewal' },
  { key: 'mr', text: 'MANAGER RENEWAL', value: 'Carrier_Manager_Renewal' },
];

class AddPerson extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    newPeople: PropTypes.array.isRequired,
    saving: PropTypes.bool.isRequired,
    addNewPerson: PropTypes.func.isRequired,
    removeNewPerson: PropTypes.func.isRequired,
    saveNewPersons: PropTypes.func.isRequired,
    updateNewPerson: PropTypes.func.isRequired,
    selectedCarrier: PropTypes.object.isRequired,
  };

  render() {
    const { newPeople, addNewPerson, removeNewPerson, updateNewPerson, saveNewPersons, saving, selectedCarrier } = this.props;
    let disabled = false;
    for (let i = 0; i < newPeople.length; i += 1) {
      if (!newPeople[i].firstName || !newPeople[i].lastName || !newPeople[i].email || !newPeople[i].type) {
        disabled = true;
      }
    }

    return (
      <div className="add-person">
        <Helmet
          title="Sales/Presales - Add"
          meta={[
            { name: 'description', content: 'Sales/Presales - Add' },
          ]}
        />
        <Grid stackable as={Segment} className="gridSegment">
          <Grid.Row className="header-main">
            <Header as="h2">Add Person</Header>
            <div className="divider" />
          </Grid.Row>
          { newPeople.map((person, index) => (
            <Grid.Row key={index}>
              <Grid.Column width="4">
                <span className="header3">New Person</span>
              </Grid.Column>
              <Grid.Column width="12">
                <Table className="data-table basic" unstackable>
                  <Table.Header>
                    <Table.Row className="data-table-head">
                      <Table.HeaderCell width="8"><div className="header3">Information</div></Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row className="data-table-body">
                      <Table.Cell verticalAlign="top">
                        <Grid>
                          <Grid.Row>
                            <Grid.Column width="10">
                              <Form>
                                <Form.Input label="First Name" placeholder="John" value={person.firstName} onChange={(e) => { updateNewPerson(index, 'firstName', e.target.value, selectedCarrier.carrierId); }}></Form.Input>
                                <Form.Input label="Last Name" placeholder="Smith" value={person.lastName} onChange={(e) => { updateNewPerson(index, 'lastName', e.target.value, selectedCarrier.carrierId); }}></Form.Input>
                                <Form.Input label="Email" placeholder="jsmith@example.com" value={person.email} onChange={(e) => { updateNewPerson(index, 'email', e.target.value, selectedCarrier.carrierId); }}></Form.Input>
                                <Form.Select options={options} label="Type" placeholder="Sales/Presales/Manager/Renewal" value={person.type} onChange={(e, inputState) => { updateNewPerson(index, 'type', inputState.value, selectedCarrier.carrierId); }} />
                              </Form>
                            </Grid.Column>
                            <Grid.Column>
                              <span className="personRemove" onClick={() => { removeNewPerson(index); }}>
                                <Icon name="remove" />
                              </span>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid.Row>
          ))}
          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={12}>
              <span className="button-add-another" onClick={(e) => { e.preventDefault(); addNewPerson(); }}><Icon name={'add circle'} color={'blue'} />Add another</span>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid stackable as={Segment} className="gridSegment">
          <Grid.Row className="header-main">
            <Header as="h2">Save Changes</Header>
            <div className="divider" />
          </Grid.Row>
          <Grid.Row>
            <Table className="data-table" unstackable>
              <Table.Header>
                <Table.Row className="data-table-head">
                  <Table.HeaderCell width="5">Type</Table.HeaderCell>
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row className="data-table-body">
                  <Table.Cell width="5" verticalAlign="top">Persons</Table.Cell>
                  <Table.Cell verticalAlign="middle">
                    <div className="buttons-list">
                      <Button
                        disabled={disabled}
                        size="big"
                        color="orange"
                        onClick={saveNewPersons}
                        className="upload-separate not-link-button"
                        primary
                      >Save
                      </Button>
                    </div>
                    <Loader inline active={saving} />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default AddPerson;
