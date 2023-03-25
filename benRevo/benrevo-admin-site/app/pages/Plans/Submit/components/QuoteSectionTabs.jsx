import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { Grid, Table, Button, Loader, Segment, Header, Dimmer } from 'semantic-ui-react';
import QuoteDeleteModal from './QuoteDeleteModal';
import OptionNetworkItem from './OptionNetworkItem';
import RenewalUploadModal from './RenewalUploadModal';
import { HeaderDivider } from '../componentStyles';
import { NEW_BUSINESS_TYPE, RENEWAL_TYPE } from '../../constants';
import { selectedCarrier } from '../../../../config';

class QuoteSectionTabs extends React.Component {
  static propTypes = {
    quoteFileName: PropTypes.object.isRequired,
    quotesFiles: PropTypes.object.isRequired,
    previewFiles: PropTypes.object.isRequired,
    quoteDates: PropTypes.object.isRequired,
    loadingQuotes: PropTypes.object.isRequired,
    selectedClient: PropTypes.object.isRequired,
    uploadQuote: PropTypes.func.isRequired,
    showInfo: PropTypes.func.isRequired,
    uploadDentalQuote: PropTypes.func.isRequired,
    previewQuote: PropTypes.func.isRequired,
    deleteQuote: PropTypes.func.isRequired,
    loadingOption1: PropTypes.bool,
    loadingPlans: PropTypes.bool,
    quotesLatest: PropTypes.object.isRequired,
    quoteNetworks: PropTypes.object.isRequired,
    changeOption1Group: PropTypes.func.isRequired,
    changeOption1: PropTypes.func.isRequired,
    saveOption1: PropTypes.func.isRequired,
    option1: PropTypes.object.isRequired,
    changeOption1Match: PropTypes.func.isRequired,
    changeUsage: PropTypes.func.isRequired,
    option1Difference: PropTypes.object.isRequired,
    getQuoteNetworks: PropTypes.func.isRequired,
    getDifference: PropTypes.func.isRequired,
    clientPlans: PropTypes.array.isRequired,
    medicalUsage: PropTypes.bool,
    kaiserUsage: PropTypes.bool,
    dentalUsage: PropTypes.bool,
    visionUsage: PropTypes.bool,
    medicalRenewalUsage: PropTypes.bool,
    dentalRenewalUsage: PropTypes.bool,
    visionRenewalUsage: PropTypes.bool,
    selectedQuoteType: PropTypes.string.isRequired,
    changeSelectedQuoteType: PropTypes.func.isRequired,
    uploadMedicalExists: PropTypes.func.isRequired,
    modLetterDate: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      quoteDeleteModalOpen: false,
      fileToDelete: '',
      deleteQuoteType: '',
      renewalUploadModalOpen: false,
    };

    this.uploadQuote = this.uploadQuote.bind(this);
    this.uploadDentalQuote = this.uploadDentalQuote.bind(this);
    this.previewQuote = this.previewQuote.bind(this);
    this.toggleQuoteDeleteModal = this.toggleQuoteDeleteModal.bind(this);
    this.toggleRenewalUploadModal = this.toggleRenewalUploadModal.bind(this);
  }

  componentWillMount() {
    this.props.getQuoteNetworks();
    this.props.getDifference();
  }

  uploadQuote(acceptedFiles, category, kaiser = false) {
    this.props.uploadQuote({ file: acceptedFiles, category, kaiser });
  }

  uploadDentalQuote(acceptedFiles, category, type, actionType) {
    if (acceptedFiles.length > 20) {
      const notificationOpts = {
        message: 'You can upload no more than twenty DPPO quotes.',
        position: 'tc',
        autoDismiss: 5,
      };
      this.props.showInfo(notificationOpts);
      return;
    }

    this.props.uploadDentalQuote(type, (type === 'DPPO') ? acceptedFiles : acceptedFiles[0], category, actionType);
  }

  previewQuote(acceptedFiles, category, kaiser = false) {
    this.props.previewQuote({ file: (acceptedFiles) ? acceptedFiles[0] : null, category, kaiser });
  }

  toggleQuoteDeleteModal(toDelete, quoteType) {
    this.setState({ quoteDeleteModalOpen: !this.state.quoteDeleteModalOpen });
    if (typeof toDelete === 'string') {
      this.setState({ fileToDelete: toDelete.substring(0, 15), deleteQuoteType: quoteType });
    } else {
      this.setState({ fileToDelete: '' });
    }
  }

  toggleRenewalUploadModal() {
    this.setState({ renewalUploadModalOpen: !this.state.renewalUploadModalOpen });
  }

  useLongestFileName(filesList) {
    let longestName = '';
    if (filesList.DHMO) longestName = filesList.DHMO.name;
    if (filesList.DPPO.length) {
      for (let i = 0; i < filesList.DPPO.length; i += 1) {
        if (filesList.DPPO[i].name.length > longestName.length) {
          longestName = filesList.DPPO[i].name;
        }
      }
    }
    this.toggleQuoteDeleteModal(longestName, 'dental');
  }

  render() {
    const {
      quoteFileName,
      quotesFiles,
      previewFiles,
      loadingQuotes,
      quoteDates,
      selectedClient,
      deleteQuote,
      loadingOption1,
      loadingPlans,
      quotesLatest,
      quoteNetworks,
      changeOption1Group,
      changeOption1,
      saveOption1,
      option1,
      changeOption1Match,
      changeUsage,
      option1Difference,
      medicalUsage,
      kaiserUsage,
      dentalUsage,
      visionUsage,
      clientPlans,
      selectedQuoteType,
      changeSelectedQuoteType,
      medicalRenewalUsage,
      dentalRenewalUsage,
      visionRenewalUsage,
      uploadMedicalExists,
      modLetterDate,
    } = this.props;
    const anthem = selectedCarrier.value === 'ANTHEM_BLUE_CROSS';
    const uhc = selectedCarrier.value === 'UHC';
    let typeSuffix = '';
    if (selectedQuoteType === RENEWAL_TYPE) {
      typeSuffix = 'Renewal';
    }
    const uploadRow = (cat) => {
      let category = cat;
      let title = '';
      let type = '';
      // May be used for a future feature request, but I commented out the use
      // for this PR since it isn't currently required
      // let correspondingUploaded = false;
      if (selectedQuoteType === RENEWAL_TYPE) {
        category = category.replace('Renewal', '');
        // if ((!(quotesFiles.DPPO.length > 0) && !quotesFiles.DHMO) && quoteFileName[category.replace('Renewal', '')] && quoteFileName[category.replace('Renewal', '')].length > 0) {
        //   correspondingUploaded = true;
        // }
      }
      // } else {
      title = (category === 'kaiser') ? 'Medical with Kaiser' : category;
      type = (category === 'kaiser') ? 'medical' : category;
      // if ((!(quotesFiles.DPPO.length > 0) && !quotesFiles.DHMO) && quoteFileName[`${category}Renewal`] && quoteFileName[`${category}Renewal`].length > 0) {
      //   correspondingUploaded = true;
      // }
      // }
      title = (category === 'modLetter') ? 'Renewal Modificiation Letter' : title;
      return (
        <Table.Row className="data-table-body">
          <Table.Cell verticalAlign="top">
            <div>{title}</div>
            {(!anthem || category !== 'dental') && <div className="data-table-body-sub">{quoteFileName[category]}</div> }
            {anthem && category === 'dental' && !quotesFiles.DPPO.length && !quotesFiles.DHMO &&
              <div className="data-table-body-sub">{quoteFileName[category]}</div>
            }
            {anthem && category === 'dental' && quotesFiles.DHMO &&
              <div className="data-table-body-sub"><div>DHMO:</div> {quotesFiles.DHMO.name}</div>
            }
            {anthem && category === 'dental' && quotesFiles.DPPO.length > 0 &&
            <div>
              {quotesFiles.DPPO.map((item, key) => <div key={key} className="data-table-body-sub"><div>DPPO:</div> {item.name}</div>)}
            </div>
            }
            {anthem && category === 'dental' && previewFiles.DHMO &&
              <div className="data-table-body-sub"><div>Preview DHMO:</div> {previewFiles.DHMO.name}</div>
            }
            {anthem && category === 'dental' && previewFiles.DPPO.length > 0 &&
              <div>
                {previewFiles.DPPO.map((item, key) => <div key={key} className="data-table-body-sub"><div>Preview DPPO:</div> {item.name}</div>)}
              </div>
            }
          </Table.Cell>
          <Table.Cell verticalAlign="top">
            { category !== 'modLetter' && !loadingQuotes[category] && <div>{quoteDates[category]}</div> }
            { category === 'modLetter' && <div>{modLetterDate}</div> }
            <Loader inline active={loadingQuotes[category]} />
          </Table.Cell>
          <Table.Cell textAlign="right" verticalAlign="top">
            {(!anthem || category !== 'dental') &&
            <Dropzone onDrop={(acceptedFiles) => { this.previewQuote(acceptedFiles, type, category === 'kaiser'); }} className="drop-zone" multiple={false} activeClassName="active" rejectClassName="reject">
              <Button disabled={loadingQuotes[category] || selectedClient.clientState === 'RFP_STARTED'} size="medium" color="grey" className="upload-separate not-link-button" primary>Preview</Button>
            </Dropzone>
            }
            {anthem && category === 'dental' &&
            <div className="buttons-list">
              <Dropzone onDrop={(acceptedFiles) => { this.uploadDentalQuote(acceptedFiles, type, 'DHMO', 'preview'); }} className="drop-zone" multiple={false} activeClassName="active" rejectClassName="reject">
                <Button disabled={loadingQuotes[category] || selectedClient.clientState === 'RFP_STARTED'} size="medium" color="grey" className="upload-separate not-link-button" primary>Preview DHMO</Button>
              </Dropzone>
              <Dropzone onDrop={(acceptedFiles) => { this.uploadDentalQuote(acceptedFiles, type, 'DPPO', 'preview'); }} className="drop-zone" multiple activeClassName="active" rejectClassName="reject">
                <Button disabled={loadingQuotes[category] || selectedClient.clientState === 'RFP_STARTED'} size="medium" color="grey" className="upload-separate not-link-button" primary>Preview DPPO</Button>
              </Dropzone>
              <Button onClick={() => { this.previewQuote(null, type, category === 'kaiser'); }} disabled={loadingQuotes[category] || selectedClient.clientState === 'RFP_STARTED'} size="medium" color="grey" className="upload-separate not-link-button" primary>PREVIEW</Button>
            </div>
            }
          </Table.Cell>
          <Table.Cell textAlign="right" verticalAlign="top">
            {(!anthem || category !== 'dental') && !(uhc && category === 'medical' && selectedQuoteType === RENEWAL_TYPE) &&
              <Dropzone onDrop={(acceptedFiles) => { this.uploadQuote(acceptedFiles, type, category === 'kaiser'); }} className="drop-zone" multiple={false} activeClassName="active" rejectClassName="reject" disableClick={loadingQuotes[category] || selectedClient.clientState === 'RFP_STARTED'/* || correspondingUploaded*/}>
                <Button disabled={loadingQuotes[category] || selectedClient.clientState === 'RFP_STARTED'/* || correspondingUploaded*/} size="medium" className="upload-separate not-link-button" primary>Upload</Button>
              </Dropzone>
            }
            {(uhc && category === 'medical' && selectedQuoteType === RENEWAL_TYPE && (quoteDates[category] !== 'N/A')) &&
              <Button onClick={() => { this.toggleRenewalUploadModal(); }} disabled={loadingQuotes[category] || selectedClient.clientState === 'RFP_STARTED'/* || correspondingUploaded*/} size="medium" className="upload-separate not-link-button drop-zone" primary>Upload</Button>
            }
            {(uhc && category === 'medical' && selectedQuoteType === RENEWAL_TYPE && (quoteDates[category] === 'N/A')) &&
              <Dropzone onDrop={(acceptedFiles) => { this.props.uploadMedicalExists({ file: acceptedFiles, overwrite: true, category: 'medical' }); }} className="drop-zone" activeClassName="active" rejectClassName="reject" disableClick={loadingQuotes[category] || selectedClient.clientState === 'RFP_STARTED'/* || correspondingUploaded*/}>
                <Button disabled={loadingQuotes[category] || selectedClient.clientState === 'RFP_STARTED'/* || correspondingUploaded*/} size="medium" className="upload-separate not-link-button" primary>Upload</Button>
              </Dropzone>
            }
            {anthem && category === 'dental' &&
              <div className="buttons-list">
                <Dropzone onDrop={(acceptedFiles) => { this.uploadDentalQuote(acceptedFiles, type, 'DHMO', 'quotes'); }} className="drop-zone" multiple={false} activeClassName="active" rejectClassName="reject">
                  <Button disabled={loadingQuotes[category] || selectedClient.clientState === 'RFP_STARTED'} size="medium" className="upload-separate not-link-button" primary>Upload DHMO</Button>
                </Dropzone>
                <Dropzone onDrop={(acceptedFiles) => { this.uploadDentalQuote(acceptedFiles, type, 'DPPO', 'quotes'); }} className="drop-zone" multiple activeClassName="active" rejectClassName="reject">
                  <Button disabled={loadingQuotes[category] || selectedClient.clientState === 'RFP_STARTED'} size="medium" className="upload-separate not-link-button" primary>Upload DPPO</Button>
                </Dropzone>
                <Button onClick={() => { this.uploadQuote(null, type, category === 'kaiser'); }} disabled={loadingQuotes[category] || selectedClient.clientState === 'RFP_STARTED'} size="medium" className="upload-separate not-link-button" primary>Submit</Button>
              </div>
            }
          </Table.Cell>
          <Table.Cell>
            {(!anthem || category !== 'dental' || (!(quotesFiles.DPPO.length > 0) && !quotesFiles.DHMO)) && quoteFileName[category] && quoteFileName[category].length > 0 &&
              <Button className="remove-button quote-delete-button" onClick={() => this.toggleQuoteDeleteModal(quoteFileName[category], category)}>X</Button>
            }
            {anthem && category === 'dental' && ((quotesFiles.DPPO.length > 0) || quotesFiles.DHMO) && quoteFileName[category] && quoteFileName[category].length > 0 &&
              <Button className="remove-button quote-delete-button" onClick={() => this.useLongestFileName(quotesFiles)}>X</Button>
            }
          </Table.Cell>
        </Table.Row>
      );
    };
    const plansCategory = {
      medical: [],
      kaiser: [],
      dental: [],
      vision: [],
    };
    const optionIds = {};
    clientPlans.map((cPlan) => {
      if (!optionIds[cPlan.option_id || cPlan.client_plan_id] || cPlan.out_of_state) {
        const item = {
          planType: cPlan.planType,
          planName: cPlan.planName,
          planId: cPlan.client_plan_id,
          optionId: cPlan.option_id,
          pnnId: cPlan.pnn_id,
          isKaiser: cPlan.isKaiser,
          oos: cPlan.out_of_state,
        };

        if ((cPlan.planType === 'HMO' || cPlan.planType === 'HSA' || cPlan.planType === 'PPO')) {
          plansCategory.medical.push(item);
        }
        if ((cPlan.planType === 'HMO' || cPlan.planType === 'HSA' || cPlan.planType === 'PPO')) {
          plansCategory.kaiser.push(item);
        }
        if (cPlan.planType === 'DPPO' || cPlan.planType === 'DHMO') {
          plansCategory.dental.push(item);
        }
        if (cPlan.planType === 'VISION') {
          plansCategory.vision.push(item);
        }

        optionIds[cPlan.option_id || cPlan.client_plan_id] = true;
      }
      return true;
    });
    const hiddenOption1 = (!plansCategory.medical.length || !quotesLatest.medical) &&
      (!plansCategory.kaiser.length || !quotesLatest.kaiser) &&
      (!plansCategory.dental.length || !quotesLatest.dental) &&
      (!plansCategory.vision.length || !quotesLatest.vision);
    return (
      <Grid className="plans-review-tabs">
        { uhc &&
          <Grid.Row>
            <HeaderDivider verticalAlign="middle" width={7} />
            <Grid.Column textAlign="center" width={2}>
              <span>Quotes</span>
            </Grid.Column>
            <HeaderDivider verticalAlign="middle" width={7} />
          </Grid.Row>
        }
        { uhc &&
          <Grid.Row>
            <Grid.Column computer={8} mobile={16}>
              <Button.Group className="toggle-button-blue option-button-group" toggle basic fluid>
                <Button size="medium" active={selectedQuoteType === NEW_BUSINESS_TYPE} onClick={() => { changeSelectedQuoteType(NEW_BUSINESS_TYPE); }}>New Business</Button>
                <Button size="medium" active={selectedQuoteType === RENEWAL_TYPE} onClick={() => { changeSelectedQuoteType(RENEWAL_TYPE); }}>Renewal</Button>
              </Button.Group>
            </Grid.Column>
          </Grid.Row>
        }
        <Grid.Row>
          <Grid stackable as={Segment} className="gridSegment full-width" verticalAlign="middle">
            <Grid.Row className="header-main">
              <Header as="h2">2. Upload {selectedQuoteType === RENEWAL_TYPE && ' renewal '} quote</Header>
              <div className="divider" />
            </Grid.Row>
            <Grid.Row>
              <div />
              <Table className="data-table" unstackable>
                <Table.Header>
                  <Table.Row className="data-table-head">
                    <Table.HeaderCell width="5">Product</Table.HeaderCell>
                    <Table.HeaderCell width="2">Last Uploaded</Table.HeaderCell>
                    <Table.HeaderCell />
                    <Table.HeaderCell width="3" />
                  </Table.Row>
                </Table.Header>
                { selectedQuoteType === NEW_BUSINESS_TYPE &&
                  <Table.Body>
                    {uploadRow('medical')}
                    {uploadRow('kaiser')}
                    {uploadRow('dental')}
                    {uploadRow('vision')}
                  </Table.Body>
                }
                { selectedQuoteType === RENEWAL_TYPE &&
                  <Table.Body>
                    {uploadRow('medical')}
                    {uploadRow('dental')}
                    {uploadRow('vision')}
                    {uploadRow('modLetter')}
                  </Table.Body>
                }
              </Table>
            </Grid.Row>
          </Grid>
        </Grid.Row>

        <QuoteDeleteModal
          modalOpen={this.state.quoteDeleteModalOpen}
          modalClose={this.toggleQuoteDeleteModal}
          fileToDelete={this.state.fileToDelete}
          quoteType={this.state.deleteQuoteType}
          deleteQuote={deleteQuote}
        />
        <RenewalUploadModal
          modalOpen={this.state.renewalUploadModalOpen}
          modalClose={this.toggleRenewalUploadModal}
          uploadQuote={uploadMedicalExists}
        />

        <Grid.Row>
          <Grid stackable as={Segment} className="gridSegment" verticalAlign="middle">
            <Grid.Row className="header-main">
              <Header as="h2">3. {selectedQuoteType === RENEWAL_TYPE ? 'Create renewal option' : 'Create Option 1'}</Header>
              <div className="divider" />
            </Grid.Row>
            <Grid.Row>
              <Dimmer active={loadingOption1 || loadingPlans} inverted>
                <Loader indeterminate size="big">Getting Options</Loader>
              </Dimmer>
              { !loadingOption1 && !loadingPlans && (plansCategory.medical.length > 0 || plansCategory.dental.length > 0 || plansCategory.vision.length > 0) &&
                <Table className="data-table" unstackable>
                  <Table.Header>
                    <Table.Row className="data-table-head">
                      <Table.HeaderCell>Product</Table.HeaderCell>
                      <Table.HeaderCell>Use</Table.HeaderCell>
                      { anthem && <Table.HeaderCell width="2">Group</Table.HeaderCell> }
                      <Table.HeaderCell width="3">Current Plan</Table.HeaderCell>
                      <Table.HeaderCell width="5">Option Network</Table.HeaderCell>
                      <Table.HeaderCell width="5">Match Plan</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    { quotesLatest.medical && plansCategory.medical.map((item, i) =>
                      <OptionNetworkItem
                        key={i}
                        category={`medical${typeSuffix}`}
                        anthem={anthem}
                        title={(i === 0) ? 'Medical' : '  '}
                        data={item}
                        networks={quoteNetworks[`medical${typeSuffix}`]}
                        option1={option1[`medical${typeSuffix}`][item.planId]}
                        changeOption1={changeOption1}
                        changeOption1Match={changeOption1Match}
                        changeOption1Group={changeOption1Group}
                        changeUsage={changeUsage}
                        usage={selectedQuoteType === RENEWAL_TYPE ? medicalRenewalUsage : medicalUsage}
                      />
                    )}
                    { selectedQuoteType === NEW_BUSINESS_TYPE && quotesLatest.kaiser && plansCategory.kaiser.map((item, i) =>
                      <OptionNetworkItem
                        key={i}
                        anthem={anthem}
                        category="kaiser"
                        title={(i === 0) ? 'Medical with Kaiser' : '  '}
                        data={item}
                        networks={quoteNetworks.kaiser}
                        option1={option1.kaiser[item.planId]}
                        changeOption1={changeOption1}
                        changeOption1Match={changeOption1Match}
                        changeOption1Group={changeOption1Group}
                        changeUsage={changeUsage}
                        usage={kaiserUsage}
                      />
                    )}
                    { quotesLatest.dental && plansCategory.dental.map((item, i) =>
                      <OptionNetworkItem
                        key={i}
                        anthem={anthem}
                        category={`dental${typeSuffix}`}
                        title={(i === 0) ? 'Dental' : '  '}
                        data={item}
                        networks={quoteNetworks[`dental${typeSuffix}`]}
                        option1={option1[`dental${typeSuffix}`][item.planId]}
                        changeOption1={changeOption1}
                        changeOption1Match={changeOption1Match}
                        changeOption1Group={changeOption1Group}
                        changeUsage={changeUsage}
                        usage={selectedQuoteType === RENEWAL_TYPE ? dentalRenewalUsage : dentalUsage}
                      />
                    )}
                    { quotesLatest.vision && plansCategory.vision.map((item, i) =>
                      <OptionNetworkItem
                        key={i}
                        anthem={anthem}
                        category={`vision${typeSuffix}`}
                        title={(i === 0) ? 'Vision' : '  '}
                        data={item}
                        networks={quoteNetworks[`vision${typeSuffix}`]}
                        option1={option1[`vision${typeSuffix}`][item.planId]}
                        changeOption1={changeOption1}
                        changeOption1Match={changeOption1Match}
                        changeOption1Group={changeOption1Group}
                        changeUsage={changeUsage}
                        usage={selectedQuoteType === RENEWAL_TYPE ? visionRenewalUsage : visionUsage}
                      />
                    )}
                    { !hiddenOption1 &&
                    <Table.Row className="data-table-body data-table-body-last">
                      <Table.Cell colSpan={anthem ? 6 : 5}>
                        <Button className="not-link-button" primary size="big" onClick={saveOption1}>Create</Button>
                      </Table.Cell>
                    </Table.Row>
                    }
                  </Table.Body>
                </Table>
              }
              { !hiddenOption1 && (option1Difference.medical.length > 0 || option1Difference.dental.length > 0 || option1Difference.vision.length > 0) &&
              <Table className="data-table second" unstackable>
                <Table.Header>
                  <Table.Row className="data-table-head">
                    <Table.HeaderCell width="3">Product</Table.HeaderCell>
                    <Table.HeaderCell width="4">Current Plan</Table.HeaderCell>
                    <Table.HeaderCell width="5">Match Plan</Table.HeaderCell>
                    <Table.HeaderCell width="2">$ Difference</Table.HeaderCell>
                    <Table.HeaderCell width="2">% Difference</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  { Object.keys(option1Difference).map((product) =>
                    option1Difference[product].map((item) =>
                      item.plans.map((plan, l) =>
                        <Table.Row key={l} className="data-table-body" verticalAlign="top">
                          <Table.Cell verticalAlign="middle">
                            <div>{(l === 0) ? `${product} ${item.quoteType === 'KAISER' ? '(Kaiser)' : ''} ${item.quoteType === 'CLEAR_VALUE' ? '(Clear Value)' : ''}` : ''}</div>
                          </Table.Cell>
                          <Table.Cell verticalAlign="middle" colSpan={l === 0 ? 2 : null}>
                            {plan.currentPlanName}
                          </Table.Cell>
                          { l > 0 &&
                            <Table.Cell verticalAlign="middle">
                              {plan.matchPlanName}
                            </Table.Cell>
                          }
                          <Table.Cell verticalAlign="middle" style={{ fontWeight: (l === 0) ? '600' : '400' }}>
                            { plan.dollarDifference !== null ? `$${plan.dollarDifference}` : ''}
                          </Table.Cell>
                          <Table.Cell verticalAlign="middle" style={{ fontWeight: (l === 0) ? '600' : '400' }}>
                            { plan.dollarDifference !== null ? `${plan.percentDifference}%` : '' }
                          </Table.Cell>
                        </Table.Row>
                      )
                    )
                  )}
                </Table.Body>
              </Table>
              }
              <div className="empty">{ hiddenOption1 && !loadingOption1 && !loadingPlans && 'You have no plans' }</div>
            </Grid.Row>
          </Grid>
        </Grid.Row>
        { uhc &&
          <Grid.Row className="lower-divider">
            <HeaderDivider verticalAlign="middle" width={7} />
            <Grid.Column textAlign="center" width={2}>
              <span>End Quotes</span>
            </Grid.Column>
            <HeaderDivider verticalAlign="middle" width={7} />
          </Grid.Row>
        }
      </Grid>
    );
  }
}

export default QuoteSectionTabs;
