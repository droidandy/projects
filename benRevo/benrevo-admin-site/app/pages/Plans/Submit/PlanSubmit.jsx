import React from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router';
import { Grid, Segment, Header, TextArea, Button, Dimmer, Loader, Table, Modal } from 'semantic-ui-react';
import Helmet from 'react-helmet';
import QuoteSectionTabs from './components/QuoteSectionTabs';

class PlanSubmit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loadingPlans: PropTypes.bool,
    loadingSummary: PropTypes.bool,
    loadingOption1: PropTypes.bool,
    loadingNotification: PropTypes.bool,
    loadingApproveOnBoarding: PropTypes.bool,
    summaryDate: PropTypes.string,
    // currentPlanValid: PropTypes.object.isRequired,
    quoteDates: PropTypes.object.isRequired,
    quotesFiles: PropTypes.object.isRequired,
    previewFiles: PropTypes.object.isRequired,
    quoteFileName: PropTypes.object.isRequired,
    sentDate: PropTypes.string,
    approveDate: PropTypes.string,
    currentBroker: PropTypes.object.isRequired,
    selectedClient: PropTypes.object.isRequired,
    loadingQuotes: PropTypes.object.isRequired,
    quoteNetworks: PropTypes.object.isRequired,
    clientPlans: PropTypes.array.isRequired,
    summaries: PropTypes.object.isRequired,
    option1: PropTypes.object.isRequired,
    option1Difference: PropTypes.object.isRequired,
    quotesLatest: PropTypes.object.isRequired,
    uploadQuote: PropTypes.func.isRequired,
    uploadDentalQuote: PropTypes.func.isRequired,
    previewQuote: PropTypes.func.isRequired,
    getQuoteNetworks: PropTypes.func.isRequired,
    saveSummary: PropTypes.func.isRequired,
    sendNotification: PropTypes.func.isRequired,
    approveOnBoarding: PropTypes.func.isRequired,
    changeOption1Group: PropTypes.func.isRequired,
    changeOption1: PropTypes.func.isRequired,
    saveOption1: PropTypes.func.isRequired,
    changeOption1Match: PropTypes.func.isRequired,
    showInfo: PropTypes.func.isRequired,
    getSummary: PropTypes.func.isRequired,
    getDifference: PropTypes.func.isRequired,
    changeUsage: PropTypes.func.isRequired,
    medicalUsage: PropTypes.bool,
    kaiserUsage: PropTypes.bool,
    dentalUsage: PropTypes.bool,
    visionUsage: PropTypes.bool,
    medicalRenewalUsage: PropTypes.bool,
    dentalRenewalUsage: PropTypes.bool,
    visionRenewalUsage: PropTypes.bool,
    deleteQuote: PropTypes.func.isRequired,
    selectedQuoteType: PropTypes.string.isRequired,
    changeSelectedQuoteType: PropTypes.func.isRequired,
    uploadMedicalExists: PropTypes.func.isRequired,
    modLetterDate: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      currentSummary: '',
      summaries: {},
    };

    this.modalToggle = this.modalToggle.bind(this);
    this.changeSummary = this.changeSummary.bind(this);
    this.saveSummary = this.saveSummary.bind(this);
  }

  componentWillMount() {
    this.props.getSummary();
  }

  changeSummary(value) {
    this.setState({ summaries: { ...this.state.summaries, [this.state.currentSummary]: value } });
  }

  modalToggle(currentSummary) {
    this.setState({ modalOpen: !this.state.modalOpen });

    if (currentSummary) {
      this.setState({ currentSummary, summaries: { ...this.state.summaries, [currentSummary]: this.props.summaries[currentSummary] || '' } });
    } else this.setState({ summaries: { ...this.state.summaries, [this.state.currentSummary]: '' } });
  }

  saveSummary() {
    const category = this.state.currentSummary;
    const value = this.state.summaries[category];
    this.props.saveSummary(value, category);

    this.modalToggle();
  }

  render() {
    const {
      loadingSummary,
      loadingPlans,
      loadingOption1,
      changeOption1Group,
      loadingNotification,
      loadingApproveOnBoarding,
      summaryDate,
      quoteDates,
      sentDate,
      approveDate,
      quoteFileName,
      currentBroker,
      selectedClient,
      loadingQuotes,
      summaries,
      sendNotification,
      approveOnBoarding,
      clientPlans,
      quoteNetworks,
      quotesFiles,
      previewFiles,
      option1,
      option1Difference,
      quotesLatest,
      changeOption1,
      saveOption1,
      changeOption1Match,
      // currentPlanValid,
      changeUsage,
      medicalUsage,
      kaiserUsage,
      dentalUsage,
      visionUsage,
      medicalRenewalUsage,
      dentalRenewalUsage,
      visionRenewalUsage,
      deleteQuote,
      uploadQuote,
      showInfo,
      uploadDentalQuote,
      previewQuote,
      getQuoteNetworks,
      getDifference,
      selectedQuoteType,
      changeSelectedQuoteType,
      uploadMedicalExists,
      modLetterDate,
    } = this.props;
    const summaryCell = (summary) => <div>
      {summaries[summary] &&
      <div className="summaryCell">
        <div>{summaries[summary].substr(0, 80)} { summaries[summary].length > 80 && <span>...</span> }</div>
        <a tabIndex={0} onClick={() => { this.modalToggle(summary); }}>Change</a>
      </div>
      }
      {!summaries[summary] && <Button size="medium" name={`${summary}-summary-add`} primary onClick={() => { this.modalToggle(summary); }}>Add Notes</Button> }
    </div>;
    return (
      <div className="plans-submit">
        <Helmet
          title="Notes/Submit"
          meta={[
            { name: 'description', content: 'Description of Notes/Submit' },
          ]}
        />

        <Grid stackable as={Segment} className="gridSegment plans-summary">
          <Grid.Row className="header-second">
            <Header as="h1">{currentBroker.name} - {selectedClient.clientName}</Header>
          </Grid.Row>
          <Grid.Row className="header-main">
            <Header as="h2">1. Add Notes</Header>
            <div className="divider" />
          </Grid.Row>
          <Grid.Row>
            <Dimmer active={loadingSummary} inverted>
              <Loader indeterminate size="big">Getting summaries</Loader>
            </Dimmer>
            <Table className="data-table" unstackable>
              <Table.Header>
                <Table.Row className="data-table-head">
                  <Table.HeaderCell width="5">Product</Table.HeaderCell>
                  <Table.HeaderCell width="2">Last Modified</Table.HeaderCell>
                  <Table.HeaderCell>Summary Notes</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row className="data-table-body" verticalAlign="top">
                  <Table.Cell>
                    Medical
                  </Table.Cell>
                  <Table.Cell>
                    {summaryDate}
                  </Table.Cell>
                  <Table.Cell>
                    {summaryCell('medical')}
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="data-table-body" verticalAlign="top">
                  <Table.Cell>
                    Medical with Kaiser
                  </Table.Cell>
                  <Table.Cell>
                    {summaryDate}
                  </Table.Cell>
                  <Table.Cell>
                    {summaryCell('kaiser')}
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="data-table-body" verticalAlign="top">
                  <Table.Cell>
                    Dental
                  </Table.Cell>
                  <Table.Cell>
                    {summaryDate}
                  </Table.Cell>
                  <Table.Cell>
                    {summaryCell('dental')}
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="data-table-body" verticalAlign="top">
                  <Table.Cell>
                    Vision
                  </Table.Cell>
                  <Table.Cell>
                    {summaryDate}
                  </Table.Cell>
                  <Table.Cell>
                    {summaryCell('vision')}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <Modal
              className="summary-modal"
              open={this.state.modalOpen}
              size="small"
              dimmer={false}
            >
              <a tabIndex="0" className="close-modal" onClick={() => { this.modalToggle(); }}>X</a>
              <div className="header-main">
                <Header as="h2">Add {this.state.currentSummary} Notes</Header>
              </div>
              <TextArea value={this.state.summaries[this.state.currentSummary] || ''} onChange={(e, { value }) => { this.changeSummary(value); }} />
              <div className="buttons">
                <a tabIndex="0" className="cancel-button" onClick={() => { this.modalToggle(); }}>Cancel</a>
                <Button className="not-link-button" size="medium" primary onClick={this.saveSummary}>ADD NOTES</Button>
              </div>
            </Modal>
          </Grid.Row>
        </Grid>

        {/*
        <Grid stackable as={Segment} className="gridSegment" verticalAlign="middle">
          <Grid.Row className="header-main">
            <Header as="h2">2. Validate current plans</Header>
            <div className="divider" />
          </Grid.Row>
          <Grid.Row>
            <Dimmer active={loadingPlans} inverted>
              <Loader indeterminate size="big">Getting plans</Loader>
            </Dimmer>
            {(currentPlanValid.dental || currentPlanValid.medical || currentPlanValid.vision) &&
              <Table className="data-table" unstackable>
                <Table.Header>
                  <Table.Row className="data-table-head">
                    <Table.HeaderCell width="5">Product</Table.HeaderCell>
                    <Table.HeaderCell width="2">Status</Table.HeaderCell>
                    <Table.HeaderCell />
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {currentPlanValid.medical &&
                  <Table.Row className="data-table-body" verticalAlign="top">
                    <Table.Cell>Medical</Table.Cell>
                    <Table.Cell>{ currentPlanValid.medical.valid ? 'Complete' : 'Incomplete' }</Table.Cell>
                    <Table.Cell><Button as={Link} to="/client/plans/medical" className="not-link-button" primary size="medium">Go to page</Button></Table.Cell>
                  </Table.Row>
                  }
                  {currentPlanValid.dental &&
                  <Table.Row className="data-table-body" verticalAlign="top">
                    <Table.Cell>Dental</Table.Cell>
                    <Table.Cell>{ currentPlanValid.dental.valid ? 'Complete' : 'Incomplete' }</Table.Cell>
                    <Table.Cell><Button as={Link} to="/client/plans/dental" className="not-link-button" primary size="medium">Go to page</Button></Table.Cell>
                  </Table.Row>
                  }
                  {currentPlanValid.vision &&
                  <Table.Row className="data-table-body" verticalAlign="top">
                    <Table.Cell>Vision</Table.Cell>
                    <Table.Cell>{ currentPlanValid.vision.valid ? 'Complete' : 'Incomplete' }</Table.Cell>
                    <Table.Cell><Button as={Link} to="/client/plans/vision" className="not-link-button" primary size="medium">Go to page</Button></Table.Cell>
                  </Table.Row>
                  }
                </Table.Body>
              </Table>
            }
            {!currentPlanValid.dental && !currentPlanValid.medical && !currentPlanValid.vision &&
              <div className="empty">
                { !loadingPlans && 'No plans for this client' }
              </div>
            }
          </Grid.Row>
        </Grid>
        */}

        <QuoteSectionTabs
          quoteFileName={quoteFileName}
          quotesFiles={quotesFiles}
          previewFiles={previewFiles}
          quoteDates={quoteDates}
          loadingQuotes={loadingQuotes}
          selectedClient={selectedClient}
          uploadQuote={uploadQuote}
          showInfo={showInfo}
          uploadDentalQuote={uploadDentalQuote}
          previewQuote={previewQuote}
          deleteQuote={deleteQuote}
          loadingOption1={loadingOption1}
          loadingPlans={loadingPlans}
          quotesLatest={quotesLatest}
          quoteNetworks={quoteNetworks}
          changeOption1Group={changeOption1Group}
          changeOption1={changeOption1}
          saveOption1={saveOption1}
          option1={option1}
          changeOption1Match={changeOption1Match}
          changeUsage={changeUsage}
          option1Difference={option1Difference}
          medicalUsage={medicalUsage}
          kaiserUsage={kaiserUsage}
          dentalUsage={dentalUsage}
          visionUsage={visionUsage}
          medicalRenewalUsage={medicalRenewalUsage}
          dentalRenewalUsage={dentalRenewalUsage}
          visionRenewalUsage={visionRenewalUsage}
          getQuoteNetworks={getQuoteNetworks}
          getDifference={getDifference}
          clientPlans={clientPlans}
          selectedQuoteType={selectedQuoteType}
          changeSelectedQuoteType={changeSelectedQuoteType}
          uploadMedicalExists={uploadMedicalExists}
          modLetterDate={modLetterDate}
        />

        { /*
        <Grid stackable as={Segment} className="gridSegment" verticalAlign="middle">
          <Grid.Row className="header-main">
            <Header as="h2">5. Review information</Header>
            <div className="divider" />
          </Grid.Row>
          <Grid.Row>
            <div />
            <Table className="data-table" unstackable>
              <Table.Header>
                <Table.Row className="data-table-head">
                  <Table.HeaderCell width="5">Client</Table.HeaderCell>
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row className="data-table-body" verticalAlign="top">
                  <Table.Cell>
                    <div>{currentBroker.name} -</div>
                    <div>{selectedClient.clientName}</div>
                  </Table.Cell>
                  <Table.Cell>
                    <Button as={Link} to="/client/plans/review" primary size="big">Review</Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Row>
        </Grid>
        */}

        <Grid stackable as={Segment} className="gridSegment">
          <Grid.Row className="header-main">
            <Header as="h2">4. Send email to broker</Header>
            <div className="divider" />
          </Grid.Row>
          <Grid.Row>
            <div />
            <Table className="data-table" unstackable>
              <Table.Header>
                <Table.Row className="data-table-head">
                  <Table.HeaderCell width="5">To</Table.HeaderCell>
                  <Table.HeaderCell width="2">Last Sent</Table.HeaderCell>
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row className="data-table-body" verticalAlign="top">
                  <Table.Cell>
                    <div>{currentBroker.name} -</div>
                    <div>{selectedClient.clientName}</div>
                  </Table.Cell>
                  <Table.Cell>
                    { !loadingNotification && <span>{sentDate}</span> }
                    <Loader inline active={loadingNotification} />
                  </Table.Cell>
                  <Table.Cell>
                    <Button className="not-link-button" primary size="big" color="orange" onClick={sendNotification}>Send to Broker</Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Row>
        </Grid>

        <Grid stackable as={Segment} className="gridSegment">
          <Grid.Row className="header-main">
            <Header as="h2">5. Approve for On-Boarding</Header>
            <div className="divider" />
          </Grid.Row>
          <Grid.Row>
            <div />
            <Table className="data-table" unstackable>
              <Table.Header>
                <Table.Row className="data-table-head">
                  <Table.HeaderCell width="5">To</Table.HeaderCell>
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row className="data-table-body" verticalAlign="top">
                  <Table.Cell>
                    <div>{currentBroker.name} -</div>
                    <div>{selectedClient.clientName}</div>
                  </Table.Cell>
                  <Table.Cell>
                    { !loadingApproveOnBoarding && <span>{approveDate}</span> }
                    <Loader inline active={loadingApproveOnBoarding} />
                  </Table.Cell>
                  <Table.Cell>
                    <Button className="not-link-button" disabled={(selectedClient.clientState !== 'PENDING_APPROVAL') || loadingApproveOnBoarding} primary size="big" color="orange" onClick={approveOnBoarding}>Approve</Button>
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

export default PlanSubmit;
