import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Checkbox } from 'semantic-ui-react';
import DentalFields from './DentalFields';
import DentalHeader from './DentalHeader';

class ProductDentalBenefits extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    plans: PropTypes.array.isRequired,
    benefitsPlans: PropTypes.array.isRequired,
    selectedBenefits: PropTypes.object.isRequired,
    changeField: PropTypes.func.isRequired,
    selectBenefits: PropTypes.func.isRequired,
    templates: PropTypes.object.isRequired,
  };

  render() {
    const {
      section,
      title,
      plans,
      benefitsPlans,
      templates,
      changeField,
      selectBenefits,
      selectedBenefits,
    } = this.props;
    let selectedCount = 0;

    Object.keys(selectedBenefits).map((item) => {
      if (selectedBenefits[item]) selectedCount += 1;
    });

    return (
      <Grid className="prequote-benefits">
        <Grid.Row>
          <Grid.Column width={16} textAlign="center">
            <Header as="h1" className="title1">{title} PPO</Header>
            <div className="title1-description">
             No DPPO Plan Selected
            </div>
          </Grid.Column>
        </Grid.Row>
        { plans.map((plan, i) => {
          const planType = plan.title;
          const template = templates[planType];
          const benefitPlan = benefitsPlans[i] || template;

          if (planType === 'DPPO') {
            const coverage = benefitPlan.benefits.slice(0, 11);
            const basic = benefitPlan.benefits.slice(11, 13);
            const waiting = benefitPlan.benefits.slice(13, 16);
            const copay = benefitPlan.benefits.slice(16, 17);
            const deductibles = benefitPlan.benefits.slice(17, 21);
            const annual = benefitPlan.benefits.slice(21, 25);
            const oOPocket = benefitPlan.benefits.slice(25, 27);
            const oONetwork = benefitPlan.benefits.slice(27, 28);
            const age = benefitPlan.benefits.slice(28, 30);
            const optional = benefitPlan.benefits.slice(30, 36);
            const customization = benefitPlan.benefits.slice(36, 43);

            // IMPORTANT: Please, attention to benefitIndex!! Each part is starting from previous index!!

            return (
              <Grid.Row key={i}>
                <Grid.Column width={16}>
                  <Header as="h1" className="title2 inline">Option {i + 1}</Header>
                  {/* <div className="select-option">
                    <Checkbox
                      disabled={selectedCount === 2 && !selectedBenefits[i]}
                      label="Current plan"
                      checked={selectedBenefits[i]}
                      onChange={(e, inputState) => { selectBenefits(section, i, inputState.checked); }}
                    />
                  </div> */}
                </Grid.Column>
                <Grid.Column width={2} only="computer" />
                <Grid.Column computer={13} tablet={16} mobile={16}>
                  <Grid>
                    <DentalHeader title="COVERAGE" info="*Consumer Choice PPO minimum coinsurance of 50% for all coverage categories" long />
                    <Grid.Row>
                      <Grid.Column width={4} className="labelColumn" verticalAlign="middle">
                      </Grid.Column>
                      <Grid.Column width={4} className="labelColumn network" verticalAlign="middle">
                        <span>IN-NETWORK</span>
                      </Grid.Column>
                      <Grid.Column width={4} className="labelColumn network" verticalAlign="middle">
                        <span>OUT-NETWORK</span>
                      </Grid.Column>
                    </Grid.Row>
                    { coverage.map((item, j) => <DentalFields
                      key={item.sysName}
                      item={item}
                      planType={planType}
                      planIndex={i}
                      benefitIndex={j}
                      changeField={changeField}
                    />)}
                    <DentalHeader title="BASIC & MAJOR SERVICES WAITING PERIODS" info="" />
                    { basic.map((item, j) => <DentalFields
                      key={item.sysName}
                      item={item}
                      planType={planType}
                      planIndex={i}
                      benefitIndex={11 + j}
                      changeField={changeField}
                    />)}
                    <DentalHeader title="ORTHODONTIC COVERAGE & WAITING PERIODS" info="" />
                    { waiting.map((item, j) => <DentalFields
                      key={item.sysName}
                      item={item}
                      planType={planType}
                      planIndex={i}
                      benefitIndex={13 + j}
                      changeField={changeField}
                    />)}
                    <DentalHeader title="OFFICE VISIT COPAY" info="*Only available with Essential Choice" />
                    { copay.map((item, j) => <DentalFields
                      key={item.sysName}
                      item={item}
                      planType={planType}
                      planIndex={i}
                      benefitIndex={16 + j}
                      changeField={changeField}
                    />)}
                    <DentalHeader title="Deductibles" info="*No life time deductibles on Consumer Choice; deductible must be <$250 for Essential Choice, >$100 for Consumer Choice*" />
                    <Grid.Row>
                      <Grid.Column width={4} className="labelColumn" verticalAlign="middle">
                      </Grid.Column>
                      <Grid.Column width={4} className="labelColumn network" verticalAlign="middle">
                        <span>IN-NETWORK</span>
                      </Grid.Column>
                      <Grid.Column width={4} className="labelColumn network" verticalAlign="middle">
                        <span>OUT-NETWORK</span>
                      </Grid.Column>
                    </Grid.Row>
                    { deductibles.map((item, j) => <DentalFields
                      key={item.sysName}
                      item={item}
                      planType={planType}
                      planIndex={i}
                      benefitIndex={17 + j}
                      changeField={changeField}
                    />)}
                    <DentalHeader title="Annual Maximums" info="*Only available with Essential Choice" />
                    <Grid.Row>
                      <Grid.Column width={4} className="labelColumn" verticalAlign="middle">
                      </Grid.Column>
                      <Grid.Column width={4} className="labelColumn network" verticalAlign="middle">
                        <span>IN-NETWORK</span>
                      </Grid.Column>
                      <Grid.Column width={4} className="labelColumn network" verticalAlign="middle">
                        <span>OUT-NETWORK</span>
                      </Grid.Column>
                    </Grid.Row>
                    { annual.map((item, j) => <DentalFields
                      key={item.sysName}
                      item={item}
                      planType={planType}
                      planIndex={i}
                      benefitIndex={21 + j}
                      changeField={changeField}
                    />)}
                    <DentalHeader title="OUT-OF-POCKET MAX." info="*Only available with Essential Choice" />
                    <Grid.Row>
                      <Grid.Column width={4} className="labelColumn" verticalAlign="middle">
                      </Grid.Column>
                      <Grid.Column width={4} className="labelColumn network" verticalAlign="middle">
                        <span>IN-NETWORK</span>
                      </Grid.Column>
                      <Grid.Column width={4} className="labelColumn network" verticalAlign="middle">
                        <span>OUT-NETWORK</span>
                      </Grid.Column>
                    </Grid.Row>
                    { oOPocket.map((item, j) => <DentalFields
                      key={item.sysName}
                      item={item}
                      planType={planType}
                      planIndex={i}
                      benefitIndex={25 + j}
                      changeField={changeField}
                    />)}
                    <DentalHeader title="OUT-OF-NETWORK REIMBURSEMENT" info="" />
                    { oONetwork.map((item, j) => <DentalFields
                      key={item.sysName}
                      item={item}
                      planType={planType}
                      planIndex={i}
                      benefitIndex={27 + j}
                      changeField={changeField}
                    />)}
                    <DentalHeader title="Dependent Age" info="*This section may be skipped excluding those benefits requiring customization*" />
                    { age.map((item, j) => <DentalFields
                      key={item.sysName}
                      item={item}
                      planType={planType}
                      planIndex={i}
                      benefitIndex={28 + j}
                      changeField={changeField}
                    />)}
                    <DentalHeader title="Optional Benefits" info="*This section may be skipped excluding those benefits requiring customization*" />
                    { optional.map((item, j) => <DentalFields
                      key={item.sysName}
                      item={item}
                      planType={planType}
                      planIndex={i}
                      benefitIndex={30 + j}
                      changeField={changeField}
                    />)}
                    <DentalHeader title="Benefit Customization" info="*This section may be skipped excluding those benefits requiring customization*" />
                    { customization.map((item, j) => <DentalFields
                      key={item.sysName}
                      item={item}
                      planType={planType}
                      planIndex={i}
                      benefitIndex={36 + j}
                      changeField={changeField}
                    />)}
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            );
          }

          return null;
        })}
      </Grid>
    );
  }
}

export default ProductDentalBenefits;
