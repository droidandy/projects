import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Grid, Segment, Header, Button, Divider, Form, Radio, Checkbox, TextArea, Popup } from 'semantic-ui-react';
import { Dropzone } from '@benrevo/benrevo-react-core';
import FormBase from '../FormBaseClass';
import { validateQuote } from '../FormValidator';
import DentalAndVision from './components/DentalAndVision';
import Files from './components/Files';
import Requests from './components/Requests';
import { PLEASE_UPLOAD_SUMMARIES } from '../formConstants';

import {
  CHANGE_PLAN_FILES,
  CHANGE_SUMMARY_FILES,
  CHANGE_SELF_FUNDING,
  CHANGE_ALONG_SIDE,
  CHANGE_FULL_TAKEOVER,
  KAISER,
  CHANGE_DIAGNOSIS_AND_STATUS,
  CHANGE_ADDITIONAL_REQUESTS,
  RFP_MEDICAL_SECTION,
  RFP_DENTAL_SECTION,
  RFP_VISION_SECTION,
  RFP_LIFE_SECTION,
  RFP_STD_SECTION,
  RFP_LTD_SECTION,
} from '../constants';

class Quote extends FormBase { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    virginCoverage: PropTypes.object.isRequired,
    tierList: PropTypes.array,
    selfFunding: PropTypes.string,
    alternativeQuote: PropTypes.string,
    alongside: PropTypes.bool,
    showAlongSidePopup: PropTypes.bool.isRequired,
    takeOver: PropTypes.bool,
    ratingTiers: PropTypes.string,
    additionalRequests: PropTypes.string,
    diagnosisAndStatus: PropTypes.string,
    formErrors: PropTypes.object,
    carriers: PropTypes.array.isRequired,
    updateForm: PropTypes.func,
    setError: PropTypes.func,
    updatePlan: PropTypes.func,
    addPlanFile: PropTypes.func,
    removePlanFile: PropTypes.func,
    addFile: PropTypes.func,
    removeFile: PropTypes.func,
    diagnosisHeader: PropTypes.func.isRequired,
    claimsHeader: PropTypes.func.isRequired,
    benefitsHeader: PropTypes.func.isRequired,
    fileNote: PropTypes.func.isRequired,
    plans: PropTypes.array,
    planFiles: PropTypes.object,
    filesSummary: PropTypes.array,
    filesCurrentCarriers: PropTypes.array,
    filesClaims: PropTypes.array,
  };
  constructor(props) {
    super(props);

    this.addPlanFile = this.addPlanFile.bind(this);
  }

  runValidator() {
    return validateQuote(this.props, this.props.section);
  }

  addPlanFile(section, files, index) {
    const newMeta = {};

    this.props.addPlanFile(section, files, index);

    if (this.props.formErrors[CHANGE_PLAN_FILES]) {
      const meta = this.props.formErrors[CHANGE_PLAN_FILES].meta.indexes;
      for (let i in meta) {
        if (meta.hasOwnProperty(i) && +i !== index) {
          newMeta[i] = true;
        }
      }

      this.props.setError(section, CHANGE_PLAN_FILES, PLEASE_UPLOAD_SUMMARIES, { indexes: newMeta });
    }
  }

  render() {
    const { section,
      selfFunding, plans, planFiles, alongside, takeOver, additionalRequests, diagnosisAndStatus,
      filesSummary, filesCurrentCarriers, filesClaims, alternativeQuote, virginCoverage,
      formErrors, updateForm, updatePlan, removePlanFile, addFile, removeFile, setError, carriers, diagnosisHeader, showAlongSidePopup, fileNote, claimsHeader, benefitsHeader,
    } = this.props;
    const virgin = virginCoverage[section];
    let showKaiser = false;

    for (let i = 0; i < carriers.length; i += 1) {
      const item = carriers[i];

      if (item.title === KAISER) {
        showKaiser = true;
        break;
      }
    }

    return (
      <div>
        <Helmet
          title="Quote"
          meta={
            [{ name: 'description', content: 'Description of Quote' }]}
        />
        <Grid stackable columns={2} as={Segment} className="gridSegment rfpQuote">
          <Grid.Row>
            <Grid.Column width={16} textAlign="center" >
              <Header as="h1" className="rfpPageHeading">{section} RFP - Plans to Quote</Header>
              <Header as="h2" className="rfpPageSubHeading">What would you like to quote? </Header>
            </Grid.Column>
          </Grid.Row>
          { (section === RFP_DENTAL_SECTION || section === RFP_VISION_SECTION) &&
            plans.map(
            (item, i) => <DentalAndVision
              key={i}
              planFiles={planFiles}
              virginCoverage={virginCoverage}
              benefitsHeader={benefitsHeader}
              item={item}
              section={section}
              index={i}
              updatePlan={updatePlan}
              addPlanFile={this.addPlanFile}
              removePlanFile={removePlanFile}
              formErrors={formErrors}
              setError={setError}
              FileNote={fileNote}
            />
            )
          }
          { section === RFP_MEDICAL_SECTION &&
          <Grid.Row className="rfpRowDivider">
            <Grid.Column width={5}>
              <Header as="h3" className="rfpPageSectionHeading">Additional quote requests</Header>
            </Grid.Column>
            <Grid.Column width={11}>
              <Header as="h3" className="rfpPageFormSetHeading">Would you like us to include self funding? </Header>
              <Form>
                <Form.Field>
                  <Radio
                    label="Yes"
                    name="waitingRadioGroup"
                    value="yes"
                    checked={selfFunding === 'yes'}
                    onChange={(e, inputState) => {
                      updateForm(section, CHANGE_SELF_FUNDING, inputState.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label="No"
                    name="waitingRadioGroup"
                    value="no"
                    checked={selfFunding === 'no'}
                    onChange={(e, inputState) => {
                      updateForm(section, CHANGE_SELF_FUNDING, inputState.value);
                    }}
                  />
                </Form.Field>
              </Form>
              { showKaiser && !virgin &&
                <Header as="h3" className="rfpPageFormSetHeading">Would you like us to quote alongside Kaiser? </Header>
              }
              { showKaiser && !virgin &&
                <Form>
                  <Form.Field>
                    <Checkbox
                      label="Alongside"
                      checked={alongside}
                      onChange={(e, inputState) => { updateForm(section, CHANGE_ALONG_SIDE, inputState.checked); }}
                    />
                    { showAlongSidePopup &&
                    <Popup
                      position="top center"
                      size="tiny"
                      trigger={<span className="field-info" />}
                      content="Alongside Kaiser is unavailable with Anthem Clear Value"
                      inverted
                    />
                    }
                  </Form.Field>
                  <Form.Field>
                    <Checkbox
                      label="Full Takeover" checked={takeOver} onChange={(e, inputState) => { updateForm(section, CHANGE_FULL_TAKEOVER, inputState.checked); }}
                    />
                  </Form.Field>
                </Form>
              }
              {/* <Header as="h3" className="rfpPageFormSetHeading">Would you like to quote alternative rating
                tiers?</Header>
              <Dropdown
                placeholder="Tiers" search selection options={tierList} value={ratingTiers}
                onChange={(e, inputState) => {
                  updateForm(section, CHANGE_RATING_TIERS, inputState.value);
                }}
              /> */}
              { !virgin &&
                diagnosisHeader()
              }
              { !virgin &&
                <Form>
                  <TextArea
                    name={CHANGE_DIAGNOSIS_AND_STATUS}
                    className="rfpQuoteTextarea1"
                    value={diagnosisAndStatus || ''}
                    onChange={(e, inputState) => { updateForm(section, CHANGE_DIAGNOSIS_AND_STATUS, inputState.value); }}
                  />
                </Form>
              }
              <Header as="h3" className="rfpPageFormSetHeading">Please include any additional requests</Header>
              <Form>
                <TextArea
                  className="rfpQuoteTextarea2"
                  value={additionalRequests || ''}
                  onChange={(e, inputState) => { updateForm(section, CHANGE_ADDITIONAL_REQUESTS, inputState.value); }}
                />
              </Form>
            </Grid.Column>
          </Grid.Row>
          }
          { section === RFP_MEDICAL_SECTION &&
          <Grid.Row className="rfpRowDivider">
            <Grid.Column width={5}>
              <Header as="h3" className="rfpPageSectionHeading">Uploaded Files</Header>
            </Grid.Column>
            <Grid.Column width={11}>
              { !virgin &&
                benefitsHeader()
              }
              { virgin &&
              <Header as="h3" className="rfpPageFormSetHeading">Please upload the census</Header>
              }
              {fileNote()}
              <Dropzone
                name="filesSummary"
                errorName={CHANGE_SUMMARY_FILES}
                section={section}
                accept="pdf, xlsx, docx, xlsm" files={filesSummary} maxSize={5242880}
                onRemove={(index) => { removeFile(section, 'filesSummary', index); }}
                onDrop={(files) => { addFile(section, 'filesSummary', files); }}
                multiple
              />
              <Header as="h3" className="rfpPageFormSetHeading">If currently on a Self-Funded Product, e.g. Level Funding or if you are fully insured with claims experience, please include the current carrier&#39;s renewal package, including experience reports, large claim report, current medical plans, renewal increases  SSL, ASL, Claims Funding, and Admin Fee.</Header>
              <Dropzone
                name="filesCurrentCarriers"
                section={section}
                accept="pdf, xlsx, docx, xlsm" files={filesCurrentCarriers} maxSize={5242880}
                onRemove={(index) => { removeFile(section, 'filesCurrentCarriers', index); }}
                onDrop={(files) => { addFile(section, 'filesCurrentCarriers', files); }}
                multiple
              />
            </Grid.Column>
            <Divider />
          </Grid.Row>
          }
          { (section === RFP_LIFE_SECTION || section === RFP_STD_SECTION || section === RFP_LTD_SECTION) &&
          <Files
            virgin={virgin}
            filesSummary={filesSummary}
            removeFile={removeFile}
            addFile={addFile}
            filesClaims={filesClaims}
            section={section}
            FileNote={fileNote}
          />
          }
          { (section === RFP_LIFE_SECTION || section === RFP_STD_SECTION || section === RFP_LTD_SECTION) &&
          <Requests
            alternativeQuote={alternativeQuote}
            updateForm={updateForm}
            additionalRequests={additionalRequests}
            section={section}
            claimsHeader={claimsHeader}
          />
          }
          <Grid.Row>
            <div className="pageFooterActions">
              <Button onClick={() => { this.saveInformationSection('next'); }} primary floated={'right'} size="big">Save & Continue</Button>
              <Button onClick={() => { this.changePage('back'); }} floated={'left'} size="big" basic>Back</Button>
            </div>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Quote;
