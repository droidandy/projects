import React from 'react';
import moment from 'moment';
import { Grid, Segment, Header, Message, Loader, Checkbox, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import AddEmail from './../../components/AddEmail';
import SelectImage from './../../assets/img/svg/reply-alt.svg';
import AddImage from './../../assets/img/svg/add-icon.svg';
import DeleteImage from './../../assets/img/svg/delete-icon.svg';

class SendToListHistory extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    getCarrierEmails: PropTypes.func.isRequired,
    deleteEmail: PropTypes.func.isRequired,
    changeApprove: PropTypes.func.isRequired,
    carrierEmailList: PropTypes.array.isRequired,
    saveEmailList: PropTypes.func.isRequired,
    // saveCarrierList: PropTypes.func.isRequired,
    disclosure: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      emails: [],
      ind: null,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.saveEmailList = this.saveEmailList.bind(this);
  }
  componentWillMount() {
    this.props.getCarrierEmails();
  }
  openModal(emails, ind) {
    this.setState({ openModal: true, emails, ind });
  }
  closeModal() {
    this.setState({ openModal: false, emails: [], ind: null });
  }
  saveEmailList(stateEmails) {
    const { ind } = this.state;
    const { saveEmailList } = this.props;
    saveEmailList(ind, stateEmails);
    this.setState({ openModal: false, emails: [], ind: null });
  }
  render() {
    const {
      loading,
      carrierEmailList,
      deleteEmail,
      disclosure,
      changeApprove,
    } = this.props;
    return (
      <div className="sent-to-list-history">
        <Grid stackable container className="section-wrap">
          <Grid.Column width={16}>
            <Grid stackable as={Segment} className="gridSegment">
              <Grid.Row>
                <Grid.Column width={16}>
                  <Header as="h1" className="page-heading">Carrier Send to List { disclosure.modifyDate && <small>{moment(disclosure.modifyDate).format('DD.MM.YY hh:mma').toUpperCase()} by {disclosure.modifyBy}</small> }</Header>
                  <Message warning color="grey">
                    <Message.Header><b>IMPORTANT: </b>You should consult with your site administrator prior to making any changes.</Message.Header>
                  </Message>
                  { !loading &&
                  <div className="table-block">
                    <Table celled>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell className="carrier-cell">CARRIER</Table.HeaderCell>
                          <Table.HeaderCell className="email-cell">RFP PRODUCTS</Table.HeaderCell>
                          <Table.HeaderCell className="status-cell">
                            <div className="arrow-text">
                              Select approved carriers
                              <img src={SelectImage} alt="Select approved carriers" />
                            </div>
                          </Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        { carrierEmailList.map((item, i) =>
                          <Table.Row key={i}>
                            <Table.Cell>{item.carrierDisplayName}</Table.Cell>
                            <Table.Cell>
                              <a tabIndex={i} onClick={() => this.openModal(item.emails, i)}><img className="add-icon" src={AddImage} alt="add email" /></a>
                              { !item.emails.length && <span className="enter-hint">Enter Email(s)</span>}
                              <div className="emails">
                                { item.emails.map((email, j) =>
                                  <div className="email-item" key={j}>
                                    <span className="address">{email}</span>
                                    <a tabIndex={i + j} onClick={() => deleteEmail(i, j)}><img className="delete-icon" src={DeleteImage} alt="delete email" /></a>
                                  </div>
                                )}
                              </div>
                            </Table.Cell>
                            <Table.Cell>
                              <Checkbox checked={item.approved} onChange={(e, inputState) => changeApprove(inputState.value, i)} />
                            </Table.Cell>
                          </Table.Row>
                        )}
                      </Table.Body>
                    </Table>
                  </div>
                  }
                  { loading &&
                  <Loader indeterminate active={loading} size="big" />
                  }
                  {/* <div className="divider" />
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={12} only="computer">
                      </Grid.Column>
                      <Grid.Column tablet={16} computer={4}>
                        <Button fluid size="big" primary onClick={saveCarrierList}>Save</Button>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid> */}
                  <AddEmail emails={this.state.emails} modalToggle={this.closeModal} modalOpen={this.state.openModal} save={this.saveEmailList} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default SendToListHistory;
