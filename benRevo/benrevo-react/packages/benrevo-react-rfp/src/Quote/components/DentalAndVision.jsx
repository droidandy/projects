import React from 'react';
import PropTypes from 'prop-types';
import {Header, Grid, Form, TextArea } from 'semantic-ui-react';
import { Dropzone } from '@benrevo/benrevo-react-core';
import { CHANGE_PLAN_FILES } from '../../constants';
class DentalAndVision extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { item, section, index, planFiles, updatePlan, removePlanFile, formErrors, addPlanFile, virginCoverage, FileNote, benefitsHeader } = this.props;
    const files = (planFiles[index]) ? planFiles[index] : [];
    return (
      <Grid.Row className="rfpRowDivider">
        <Grid.Column width={5}>
          <Header as="h3" className="rfpPageSectionHeading">
            { index === 0 && 'Baseplan'}
            { index !== 0 && `Option ${index}`} details
          </Header>
          <Header as="h3" className="rfpPageSubSectionHeading">{item.title}</Header>
        </Grid.Column>
        <Grid.Column width="11">
          { !virginCoverage[section] && index === 0 &&
            <FileNote />
          }

          { !virginCoverage[section] &&
            <Header as="h3" className="rfpPageFormSetHeading">Would you like to match the current option?</Header>
          }

          { !virginCoverage[section] &&
            <Form className="rfpBlockTop">
              <Form.Group inline>
                <Form.Radio
                  label="Yes"
                  value="yes"
                  name="likeToMatchCurrent"
                  checked={item.likeToMatchCurrent === 'yes'}
                  onChange={(e, inputState) => { updatePlan(section, 'likeToMatchCurrent', inputState.value, index); }}
                />
                <Form.Radio
                  label="No"
                  value="no"
                  name="likeToMatchCurrent"
                  checked={item.likeToMatchCurrent === 'no'}
                  onChange={(e, inputState) => { updatePlan(section, 'likeToMatchCurrent', inputState.value, index); }}
                />
              </Form.Group>
            </Form>
          }

          <div className="rfpBlockTop">
            { !virginCoverage[section] &&
              benefitsHeader()
            }
            { virginCoverage[section] &&
            <Header as="h3" className="rfpPageFormSetHeading">Upload the census</Header>
            }
            <Dropzone
              name="planFiles"
              errorName={(formErrors[CHANGE_PLAN_FILES] && formErrors[CHANGE_PLAN_FILES].meta.indexes[index]) ? CHANGE_PLAN_FILES : null}
              section={section}
              accept="pdf, xlsx, docx, xlsm"
              files={files}
              maxSize={5242880}
              onRemove={(fileIndex) => { removePlanFile(section, index, fileIndex) }}
              onDrop={(items) => { addPlanFile(section, items, index); }}
              multiple
            />
          </div>

          { !virginCoverage[section] &&
            <Header as="h3" className="rfpPageFormSetHeading">Would you like to quote an alternative? </Header>
          }

          { !virginCoverage[section] &&
            <Form className="rfpBlockTop">
              <Form.Group inline>
                <Form.Radio
                  label="Yes"
                  value="yes"
                  name="alternativeQuote"
                  checked={ item.alternativeQuote === 'yes' }
                  onChange={(e, inputState) => { updatePlan(section, 'alternativeQuote', inputState.value, index); }}
                />
                <Form.Radio
                  label="No"
                  value="no"
                  name="alternativeQuote"
                  checked={ item.alternativeQuote === 'no' }
                  onChange={(e, inputState) => { updatePlan(section, 'alternativeQuote', inputState.value, index); }}
                />
              </Form.Group>
            </Form>
          }

          { (item.alternativeQuote === 'yes' || virginCoverage[section]) &&
          <div className="rfpBlockTop">
            <Header as="h3" className="rfpPageFormSetHeading">Please include any additional requests: </Header>
            <Form>
              <TextArea
                className="rfpQuoteTextarea1"
                value={item.additionalRequests}
                onChange={(e, inputState) => { updatePlan(section, 'additionalRequests', inputState.value, index); }}
              />
            </Form>
          </div>}
        </Grid.Column>
      </Grid.Row>
    )
  }
}

DentalAndVision.propTypes = {
  item: PropTypes.object.isRequired,
  formErrors: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  planFiles: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired,
  updatePlan: PropTypes.func.isRequired,
  addPlanFile: PropTypes.func.isRequired,
  removePlanFile: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  FileNote: PropTypes.func.isRequired,
  benefitsHeader: PropTypes.func,
  virginCoverage: PropTypes.object.isRequired,
};

export default DentalAndVision;
