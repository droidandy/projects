import React from "react";
import PropTypes from 'prop-types';
import validator from "validator";
import {Button, Grid, Header, Image, Input, Message, Modal, Segment, Table, Loader} from "semantic-ui-react";
import {Link} from "react-router";
import {
  DentalIcon,
  DocumentsIcon,
  MedicalIcon,
  ValidationLabel,
  VisionIcon
} from "@benrevo/benrevo-react-core";

/*
 This screen is the first item in the Presentation Nav.  It's mostly a static screen with the following dynamic items:
 "John Broker" - First and last name found in the JWT token.  Look at /pages/app/ UserProfileMenuItem and  /app/utils/authService/selectors.js for the selectBrokerage () method as an example for pulling something from the JWT.
 "Atom Biotech" -  The client from the Presentation API
 "07/17/2017" - The date from the Presentation API
 "OPTION 1 - Full network HMO / ... OPTION 3 - Full HMO / PPO / H.S.A." - The Options from the Presentation API

 Everything else is static
 */

class QuotePresentation extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    logos: PropTypes.node,
    client: PropTypes.object,
    profile: PropTypes.object,
    discounts: PropTypes.object,
    documents: PropTypes.array.isRequired,
    inviteClient: PropTypes.func.isRequired,
    getProducts: PropTypes.func.isRequired,
    downloadLifeQuote: PropTypes.func.isRequired,
    productSummary: PropTypes.object.isRequired,
    changeCurrentPage: PropTypes.func.isRequired,
    errMsg: PropTypes.string,
    carrierName: PropTypes.string,
    baseLink: PropTypes.string,
    err: PropTypes.bool,
    medical: PropTypes.object,
    dental: PropTypes.object,
    vision: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    downloadModLetter: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      inviteEmail: '',
      inviteClientError: false,
    };

    this.componentWillMount = this.componentWillMount.bind(this);
    this.modalToggle = this.modalToggle.bind(this);
    this.sendInvite = this.sendInvite.bind(this);
    this.updateInviteField = this.updateInviteField.bind(this);
  }

  componentWillMount() {
    this.props.getProducts('quote');

    // TODO LOADER to prevent page from jumping around
  }


  modalToggle() {
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  sendInvite() {
    const email = this.state.inviteEmail;
    const error = validator.isEmail(email);
    if (error) {
      this.modalToggle();
      this.props.inviteClient(email);
    }

    this.setState({ inviteClientError: !error });
  }

  updateInviteField(e, inputState) {
    this.setState({ inviteEmail: inputState.value });
  }

  render() {
    const { loading, productSummary, documents, client, logos, discounts, carrierName, baseLink, downloadLifeQuote, medical, dental, vision, downloadModLetter } = this.props;
    let quotetype = 'Medical';
    let includeText = '';
    if (medical.quotes.length) {
      includeText += 'medical';
      if (dental.quotes.length) {
        includeText += (vision.quotes.length) ?
          ', dental, and vision' : ' and dental';
      } else if (vision.quotes.length) {
        includeText += ' and vision';
      }
    } else if (dental.quotes.length) {
      quotetype = 'Dental';
      includeText += 'dental';
      if (vision.quotes.length) {
        includeText += ' and vision';
      }
    } else if (vision.quotes.length) {
      quotetype = 'Vision';
      includeText += 'vision';
    }
    const link = baseLink || `/presentation/${client.id}`;
    return (
      <div className="presentation-quote">
        { loading ?
          <Loader active />
          :
          <Grid stackable columns={2} as={Segment} className="gridSegment">
            <Grid.Row>
              <Grid.Column width="16">
                <Message warning hidden={!this.props.err}>
                  <Message.Header>{this.props.errMsg}</Message.Header>
                </Message>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row >
              <Grid.Column width="16">
                {/* <Header as="h1" className="presentationPageHeading">Quote Summary</Header> */}
                <Grid className="customDivider">
                  <Grid.Row>
                    <Grid.Column width="6" className="leftDivider" />
                    <Grid.Column width="4" className="centerText">View your quotes!</Grid.Column>
                    <Grid.Column width="6" className="rightDivider" />
                  </Grid.Row>
                </Grid>
                {/* <Button className="invite-button blue" onClick={this.modalToggle}>Invite Client</Button> */}
                {logos}
                <div className="textBlock">
                  <p>Hello { this.props.profile.givenName || this.props.profile.brokerage },</p>
                  <p>Thank you for the opportunity to provide a quote for your client, { this.props.client.clientName },
                    effective { this.props.client.effectiveDate }. I have included our {includeText} rates for your review as requested in the RFP. Please
                    note the following:</p>
                </div>
                <Grid>
                  <Grid.Row centered>
                    <Grid.Column width="6" textAlign="center">
                      <Button size="big" color="green" as={Link} fluid to={`${link}/${quotetype.toLowerCase()}`} onClick={() => { this.props.changeCurrentPage(quotetype.toLowerCase(), { currentPage: 'Options' }); }}>Start by viewing your {quotetype} Quote</Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                { productSummary &&
                <div className="productSummary">
                  <Table celled striped className="stripedBack">
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell width={4}>Product</Table.HeaderCell>
                        <Table.HeaderCell>Notes</Table.HeaderCell>
                        <Table.HeaderCell />
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row verticalAlign="top" className="quoteRow">
                        <Table.Cell className="leftCell">
                          <Link to={`${link}/medical`}>
                            <Image src={MedicalIcon} avatar style={{ marginRight: '10px' }} />
                          Medical
                          </Link>
                        </Table.Cell>
                        <Table.Cell className="rightCell">
                          <p>{productSummary.medicalNotes}</p>
                        </Table.Cell>
                        <Table.Cell className="buttonCell">
                          <Button size="medium" primary fluid as={Link} to={`${link}/medical`}>View Quote</Button>
                        </Table.Cell>
                      </Table.Row>
                      { productSummary.medicalWithKaiserNotes &&
                        <Table.Row verticalAlign="top" className="quoteRow">
                          <Table.Cell className="leftCell">
                            <Link to={`${link}/medical`}>
                              <Image src={MedicalIcon} avatar style={{ marginRight: '10px' }} />
                            Medical w/ Kaiser
                            </Link>
                          </Table.Cell>
                          <Table.Cell className="rightCell">
                            <p>{productSummary.medicalWithKaiserNotes }</p>
                          </Table.Cell>
                          <Table.Cell className="buttonCell">
                            <Button size="medium" primary fluid as={Link} to={`${link}/medical`}>View Quote</Button>
                          </Table.Cell>
                        </Table.Row>
                      }
                      <Table.Row verticalAlign="top" className="quoteRow">
                        <Table.Cell className="leftCell">
                          <Link to={`${link}/dental`}>
                            <Image src={DentalIcon} avatar style={{ marginRight: '10px' }} />
                          Dental
                          </Link>
                        </Table.Cell>
                        <Table.Cell className="rightCell">
                          <p>{productSummary.dentalNotes}</p>
                        </Table.Cell>
                        <Table.Cell className="buttonCell">
                          <Button size="medium" primary fluid as={Link} to={`${link}/dental`}>View Quote</Button>
                        </Table.Cell>
                      </Table.Row>

                      <Table.Row verticalAlign="top" className="quoteRow">
                        <Table.Cell className="leftCell">
                          <Link to={`${link}/vision`}>
                            <Image src={VisionIcon} avatar style={{ marginRight: '10px' }} />
                            Vision
                          </Link>
                        </Table.Cell>
                        <Table.Cell className="rightCell">
                          <p>{productSummary.visionNotes}</p>
                        </Table.Cell>
                        <Table.Cell className="buttonCell">
                          <Button size="medium" primary fluid as={Link} to={`${link}/vision`}>View Quote</Button>
                        </Table.Cell>
                      </Table.Row>

                      { productSummary.life && productSummary.life.length > 0 &&
                        <Table.Row verticalAlign="top" className="quoteRow">
                          <Table.Cell className="leftCell">
                            <Link>
                              <Image src={DocumentsIcon} inline style={{ marginRight: '15px' }} />
                              Life/Disability
                            </Link>
                          </Table.Cell>
                          <Table.Cell className="rightCell">
                            <p>Download your Life/Disability Quote</p>
                          </Table.Cell>
                          <Table.Cell className="buttonCell">
                            <Button size="medium" primary fluid onClick={() => { downloadLifeQuote(productSummary.life); }}>Download</Button>
                          </Table.Cell>
                        </Table.Row>
                      }

                      { productSummary.fileUpdated &&
                        <Table.Row verticalAlign="top" className="quoteRow">
                          <Table.Cell className="leftCell">
                            <Link onClick={() => { downloadModLetter(); }} className="pointer-cursor">
                              <Image src={DocumentsIcon} inline style={{ marginRight: '15px' }} />
                              <span>Renewal<br />Modifications<br />Letter</span>
                            </Link>
                          </Table.Cell>
                          <Table.Cell className="rightCell">
                            <p>Access your Renewal Modification letter here</p>
                          </Table.Cell>
                          <Table.Cell className="buttonCell" verticalAlign="middle">
                            <Button size="medium" primary fluid onClick={() => { downloadModLetter(); }}>View</Button>
                          </Table.Cell>
                        </Table.Row>
                      }

                      { documents.length > 0 &&
                        <Table.Row verticalAlign="top" className="quoteRow">
                          <Table.Cell className="leftCell">
                            <Link to={`${link}/documents`}>
                              <Image src={DocumentsIcon} inline style={{ marginRight: '15px' }} />
                              Documents
                            </Link>
                          </Table.Cell>
                          <Table.Cell className="rightCell">
                            <p>Access all your {carrierName} sales collateral here</p>
                          </Table.Cell>
                          <Table.Cell className="buttonCell" verticalAlign="middle">
                            <Button size="medium" primary fluid as={Link} to={`${link}/documents`}>View</Button>
                          </Table.Cell>
                        </Table.Row>
                      }
                    </Table.Body>
                  </Table>
                  <p><strong>Bundle our products together and wrap up the savings!</strong></p>
                  <p><strong>Save up to {discounts.total}</strong> on the health premium by adding employer-sponsored { !discounts.life && 'Dental and Vision' }{ discounts.life && 'Dental, Vision, Life and Disability' }. Here is how the savings can add up:</p>
                  <div className="ui bulleted list">
                    <div className="item"><strong>Health + Dental - {discounts.dental}</strong></div>
                    <div className="item"><strong>Health + Vision - {discounts.vision}</strong></div>
                    { discounts.life && <div className="item"><strong>Health + Life + Supplemental Life - {discounts.life}</strong></div> }
                    { discounts.ltd && <div className="item"><strong>Health + STD + LTD - {discounts.ltd}</strong></div> }
                    { discounts.std && <div className="item"><strong>Health + Supplemental Health - {discounts.std}</strong></div> }
                  </div>
                  <p>As always, we appreciate your partnership and look forward to working with you further on this
                    opportunity.</p>
                </div>
                }
              </Grid.Column>
            </Grid.Row>
          </Grid>
        }
        <Modal
          className="inviteClientModal" // eslint-disable-line react/style-prop-objec
          open={this.state.modalOpen}
          onClose={this.modalToggle}
          closeOnDocumentClick
          size="small"
          closeIcon="close"
        >
          <Header as="h1" className="presentationPageHeading">Invite client</Header>
          <Modal.Content>
            <Header as="h3">Email address:</Header>
            <Input
              placeholder="Please enter the Client's email address"
              value={this.state.inviteEmail}
              onChange={this.updateInviteField}
            />
            <ValidationLabel show={this.state.inviteClientError} error={{ msg: 'Invalid email' }} />
          </Modal.Content>
          <Modal.Actions>
            <Button basic onClick={this.modalToggle}>Close</Button>
            <Button className="blue" onClick={this.sendInvite}>Send</Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default QuotePresentation;
