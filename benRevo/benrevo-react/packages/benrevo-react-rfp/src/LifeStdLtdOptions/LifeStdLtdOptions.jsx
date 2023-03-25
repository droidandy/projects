import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Button, Form, Checkbox } from 'semantic-ui-react';
import Helmet from 'react-helmet';
import FormBase from '../FormBaseClass';
import LifeStdLtdOptionsEAP from './components/LifeStdLtdOptionsEAP';
import LifeStdLtdOptionsPlan from './components/LifeStdLtdOptionsPlan';
import {
  RFP_LTD_SECTION,
} from '../constants';

class LifeStdLtdOptions extends FormBase { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.includePlan = this.includePlan.bind(this);
  }

  static propTypes = {
    section: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    eap: PropTypes.string,
    visits: PropTypes.number,
    hideButtons: PropTypes.bool,
    hideTitle: PropTypes.bool,
    showBasic: PropTypes.bool,
    showVoluntary: PropTypes.bool,
    hideBasic: PropTypes.bool,
    hideVoluntary: PropTypes.bool,
    carrierList: PropTypes.array.isRequired,
    basicPlan: PropTypes.object.isRequired,
    voluntaryPlan: PropTypes.object.isRequired,
    dropdownOptions: PropTypes.object.isRequired,
    changeLifeStdLtdPlan: PropTypes.func.isRequired,
    addLifeStdLtdPlan: PropTypes.func.isRequired,
    removeLifeStdLtdPlan: PropTypes.func.isRequired,
    changeLifeStdLtdPlanClass: PropTypes.func.isRequired,
    updateForm: PropTypes.func.isRequired,
  };

  includePlan(type, value) {
    const props = this.props;

    if ((!value && props.basicPlan.added && props.voluntaryPlan.added) || value) props.changeLifeStdLtdPlan(props.section, type, 'added', value);
  }

  render() {
    const {
      section,
      title,
      basicPlan,
      voluntaryPlan,
      addLifeStdLtdPlan,
      removeLifeStdLtdPlan,
      changeLifeStdLtdPlanClass,
      changeLifeStdLtdPlan,
      dropdownOptions,
      eap,
      visits,
      updateForm,
      carrierList,
      hideButtons,
      hideTitle,
      showBasic,
      showVoluntary,
      hideBasic,
      hideVoluntary,
    } = this.props;

    return (
      <div>
        <Helmet
          title="Options"
          meta={[
            { name: 'description', content: 'Description of Options' },
          ]}
        />

        <Grid stackable as={Segment} className="gridSegment">
          <Grid.Row>
            <Grid.Column width={16}>
              { !hideTitle &&
                <Grid stackable columns={2} className="inner-grid-segment">
                  <Grid.Row>
                    <Grid.Column width={16} textAlign="center" >
                      <Header as="h1" className="rfpPageHeading">{title} RFP Current Options</Header>
                    </Grid.Column>
                    <Grid.Column width={16} textAlign="center">
                      <Header as="h2" className="rfpPageSubHeading">Lets talk about the plans you are on </Header>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row className="rfpRowDivider">
                    <Grid.Column width={5}>
                      <Header as="h3" className="rfpPageSectionHeading">Type of Plans</Header>
                    </Grid.Column>
                    <Grid.Column width={11}>
                      <Header as="h3" className="rfpPageFormSetHeading">Select which plans apply. You should include at least one plan.</Header>
                      <Form>
                        <Form.Field>
                          <Checkbox
                            label="Basic"
                            checked={basicPlan.added}
                            onChange={(e, inputState) => { this.includePlan('basicPlan', inputState.checked); }}
                          />
                        </Form.Field>
                        <Form.Field>
                          <Checkbox
                            label="Voluntary"
                            checked={voluntaryPlan.added}
                            onChange={(e, inputState) => { this.includePlan('voluntaryPlan', inputState.checked); }}
                          />
                        </Form.Field>
                      </Form>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              }
              {(basicPlan.added || showBasic) && !hideBasic &&
                <LifeStdLtdOptionsPlan
                  section={section}
                  title={title}
                  plan={basicPlan}
                  type="basicPlan"
                  header="Basic"
                  addLifeStdLtdPlan={addLifeStdLtdPlan}
                  removeLifeStdLtdPlan={removeLifeStdLtdPlan}
                  changeLifeStdLtdPlanClass={changeLifeStdLtdPlanClass}
                  changeLifeStdLtdPlan={changeLifeStdLtdPlan}
                  dropdownOptions={dropdownOptions}
                  carrierList={carrierList}
                />
              }
              {(voluntaryPlan.added || showVoluntary) && !hideVoluntary &&
                <LifeStdLtdOptionsPlan
                  section={section}
                  title={title}
                  plan={voluntaryPlan}
                  type="voluntaryPlan"
                  header="Voluntary"
                  addLifeStdLtdPlan={addLifeStdLtdPlan}
                  removeLifeStdLtdPlan={removeLifeStdLtdPlan}
                  changeLifeStdLtdPlanClass={changeLifeStdLtdPlanClass}
                  changeLifeStdLtdPlan={changeLifeStdLtdPlan}
                  dropdownOptions={dropdownOptions}
                  carrierList={carrierList}
                />
              }
              {section === RFP_LTD_SECTION && false &&
              <LifeStdLtdOptionsEAP
                section={section}
                visits={visits}
                eap={eap}
                updateForm={updateForm}
              />
              }
              { !hideButtons &&
                <Grid stackable className="inner-grid-segment">
                  <Grid.Row>
                    <div className="pageFooterActions">
                      <Button onClick={() => { this.saveInformationSection('next'); }} primary floated={'right'} size="big">Save & Continue</Button>
                      <Button onClick={() => { this.changePage('back'); }} floated={'left'} size="big" basic>Back</Button>
                    </div>
                  </Grid.Row>
                </Grid>
              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default LifeStdLtdOptions;
