import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import moment from 'moment';
import Scroller from 'react-scroll';
import { checkIcon } from '@benrevo/benrevo-react-core';
import { checkAll } from '../FormValidator';
import { Grid, Segment, Header, Button, Divider, Table, Message, Dimmer, Loader, Modal, Form } from 'semantic-ui-react';
const scroll = Scroller.animateScroll;

class Send extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    client: PropTypes.object.isRequired,
    Questions: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    sent: PropTypes.bool.isRequired,
    requestError  : PropTypes.bool.isRequired,
    showDisclosure: PropTypes.bool.isRequired,
    submittedDate: PropTypes.string,
    answers: PropTypes.object.isRequired,
    saveAnswers: PropTypes.func.isRequired,
    getQuestionnaire: PropTypes.func.isRequired,
    carrierName: PropTypes.string.isRequired,
  };

  constructor() {
    super();
    this.state = {
      pages: [],
      valid: true,
      open: false,
    };

    this.checkSubmit = ::this.checkSubmit;
    this.goBack = ::this.goBack;
    this.saveAnswers = this.saveAnswers.bind(this);
  }

  componentWillMount() {
    const { pages, valid } = checkAll(this.props, this.props.Questions);

    this.setState({ pages, valid });
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.answers).length > 0 && !Object.keys(this.props.answers).length) {
      const { pages, valid } = checkAll(nextProps, nextProps.Questions);
      this.setState({ pages, valid });
    }
  }

  saveAnswers() {
    const props = this.props;
    this.setState({ open: false });
    scroll.scrollTo(0, 0);
    props.saveAnswers('send');
  }

  checkSubmit() {
    const { pages } = this.state;
    // Check validation. If at least one is invalid - open warning modal
    if (pages && pages.length && pages.filter((page) => { if (!page.valid) { return page; } return null; }).length > 0) {
      this.setState({ open: true });
    } else {
      // if everything good - save
      this.saveAnswers();
    }
  }

  goBack() {
    this.setState({ open: false });
  }

  render() {
    const { pages, valid } = this.state;
    const { requestError, submittedDate, carrierName } = this.props;
    const sent = this.props.sent || submittedDate;

    const hiddenQuestionnaire = false;
    const hiddenEmployerApp = false;
    return (
      <div>
        <Helmet
          title="Send answers"
          meta={[
            { name: 'description', content: 'Description of Carrier' },
          ]}
        />
        <Grid container stackable columns={2} as={Segment} className="section-wrap send-table">
          <Dimmer active={this.props.loading} inverted>
            <Loader indeterminate>Submitting forms</Loader>
          </Dimmer>
          <Grid.Row>
            <Grid.Column width={16} textAlign="left" >
              {sent ?
                <div className="rfpSubmitSuccess">
                  <img src={checkIcon} alt="success" style={{height: '90px'}} />
                  <Header as="h1" className="rfpSuccessHeading">Your forms were sent on {moment((submittedDate) ? moment(submittedDate) : new Date()).format('MMMM Do YYYY')}</Header>
                </div>
              :
                <div>
                  <Header as="h1" className="page-heading">Preview and submit forms</Header>
                  <Message warning hidden={!requestError}>
                    <Message.Header>An error has occurred</Message.Header>
                  </Message>
                  <Message warning hidden={valid}>
                    <Message.Header>Warning - you did not fill in all the questions</Message.Header>
                  </Message>
                </div>
              }
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell width="5">Section</Table.HeaderCell>
                    <Table.HeaderCell>Status/Missing Data</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {pages.map((item) =>
                    <Table.Row key={item.page} className="question-row">
                      <Table.Cell className="send-page-list-title">
                        {item.page}
                      </Table.Cell>
                      <Table.Cell>
                        {!item.valid ? item.sections.map((section) => {
                          if (!section.valid) {
                            return (
                              <div key={section.name} className="error-link">
                                <span>{section.title}</span>
                                <Button className="btnLink" onClick={() => { this.props.changeShowErrors(true)}} as={Link} to={`/onboarding/${item.page}/${section.name}`}>Jump to page</Button>
                              </div>
                            );
                          }
                        }) : 'Complete'}
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>

                <Table.Footer>
                </Table.Footer>
              </Table>
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row>
            <Grid.Column width={16}>
              <div className="pageFooterActions">
                { !sent && <Button id="sendAnswers" onClick={this.checkSubmit} primary floated={'right'} size="big">Submit forms</Button> }
                <Button id="questionnare" disabled={hiddenQuestionnaire} onClick={this.props.getQuestionnaire} floated={'left'} basic size="big">Questionnaire</Button>
                <Button id="employerApp" disabled={hiddenEmployerApp} as={Link} to="/onboarding/employer-app" floated={'left'} basic size="big">Employer Application</Button>
              </div>
            </Grid.Column>
          </Grid.Row>

        </Grid>
        <Modal
          className="send-modal"
          open={this.state.open}
          dimmer="inverted"
          size="small"
        >
          <Modal.Content>
            <Grid stackable>
              <Grid.Row stretched>
                <Grid.Column width={16}>
                  <Header className="presentation-options-header presentation-options-header-final" as="h2">
                    Please be advised: You are about to submit the Employer Application and Implementation Questionnaire to {carrierName} with incomplete information. If you would like to continue, select <div className="note">Continue.</div> If you would like to return to the Onboarding section to complete the missing information, select <div className="note">Go Back.</div>
                  </Header>
                </Grid.Column>
                <Grid.Column width={16}>
                  <Form onSubmit={(e) => { e.preventDefault(); }}>
                    <Form.Group inline className="buttons">
                      <Button size="large" className="blue" onClick={this.goBack}>Go Back</Button>
                      <Button size="large" className="orange" onClick={this.saveAnswers}>Continue</Button>
                    </Form.Group>
                  </Form>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default Send;
