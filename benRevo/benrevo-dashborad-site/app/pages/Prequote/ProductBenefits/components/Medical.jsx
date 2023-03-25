import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Form, Input } from 'semantic-ui-react';

class ProductMedicalBenefits extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    title: PropTypes.string.isRequired,
    plans: PropTypes.array.isRequired,
    benefitsPlans: PropTypes.array.isRequired,
    changeField: PropTypes.func.isRequired,
    checkDependency: PropTypes.func.isRequired,
    templates: PropTypes.object.isRequired,
  };

  render() {
    const {
      title,
      plans,
      benefitsPlans,
      templates,
      changeField,
      checkDependency,
    } = this.props;

    return (
      <Grid className="prequote-benefits">
        <Grid.Row>
          <Grid.Column width={16} textAlign="center">
            <Header as="h1" className="title1">{title} Benefits</Header>
            <div className="title1-description">
              Let{'\''}s go over everything you need to get a quote for your client
            </div>
          </Grid.Column>
        </Grid.Row>
        { plans.map((plan, i) => {
          const planType = plan.title;
          const template = templates[planType];
          const benefitPlan = benefitsPlans[i] || template;

          return (
            <Grid.Row key={i}>
              <Grid.Column width={16}>
                <Header as="h1" className="title2 inline">{planType}</Header>
              </Grid.Column>
              <Grid.Column width={3} only="computer" />
              <Grid.Column computer={11} tablet={16} mobile={16}>
                <Grid>
                  { (planType === 'PPO' || planType === 'HSA') &&
                    <Grid.Row>
                      <Grid.Column width={6} className="labelColumn" verticalAlign="middle">
                        <span>BENEFITS</span>
                      </Grid.Column>
                      <Grid.Column width={5} className="labelColumn network" verticalAlign="middle">
                        <span>IN-NETWORK</span>
                      </Grid.Column>
                      <Grid.Column width={5} className="labelColumn network" verticalAlign="middle">
                        <span>OUT-NETWORK</span>
                      </Grid.Column>
                    </Grid.Row> ||
                    <Grid.Row>
                      <Grid.Column width={6} className="labelColumn" verticalAlign="middle">
                        <span>BENEFITS</span>
                      </Grid.Column>
                      <Grid.Column width={10} className="labelColumn" verticalAlign="middle" textAlign="center">
                        <span>IN-NETWORK</span>
                      </Grid.Column>
                    </Grid.Row>
                  }
                  { benefitPlan.benefits.map((item, j) =>
                    item.type && !item.hidden && checkDependency(item, benefitPlan.benefits) &&
                    <Grid.Row key={item.sysName} className="planInputRow">
                      <Grid.Column width={6} className="title-form" verticalAlign="middle">
                        <span>{item.name}</span>
                      </Grid.Column>
                      <Grid.Column width={10}>
                        { item.options && item.options.length &&
                        <Form.Dropdown
                          className="carrier-dropdown"
                          placeholder="Choose"
                          name={`${item.sysName}_${i}`}
                          search
                          selection
                          fluid
                          options={item.options}
                          value={item.value}
                          onChange={(e, inputState) => {
                            changeField(i, j, 'benefits', 'value', inputState.value, planType);
                          }}
                        /> ||
                        <Input
                          name={`${item.sysName}_${i}`}
                          id={item.sysName}
                          value={item.value}
                          fluid
                          placeholder={item.placeholder}
                          onChange={(e, inputState) => {
                            changeField(i, j, 'benefits', 'value', inputState.value, planType);
                          }}
                        />
                        }
                      </Grid.Column>
                    </Grid.Row> || (!item.hidden && checkDependency(item, benefitPlan.benefits)) &&
                    <Grid.Row key={item.sysName} className="planInputRow">
                      <Grid.Column width={6} className="title-form" verticalAlign="middle">
                        <span>{item.name}</span>
                      </Grid.Column>
                      <Grid.Column width={5}>
                        { item.options && item.options.length &&
                        <Form.Dropdown
                          className="carrier-dropdown"
                          placeholder="Choose"
                          name={`${item.sysName}_IN_${i}`}
                          search
                          selection
                          fluid
                          options={item.options}
                          value={item.valueIn}
                          onChange={(e, inputState) => {
                            changeField(i, j, 'benefits', 'valueIn', inputState.value, planType);
                          }}
                        /> ||
                        <Input
                          className={(item.hideIn) ? 'inline hidden' : 'inline'}
                          name={`${item.sysName}_IN_${i}`}
                          id={`${item.sysName}_IN_${i}`}
                          value={item.valueIn}
                          fluid
                          placeholder={item.placeholderIn}
                          onChange={(e, inputState) => {
                            changeField(i, j, 'benefits', 'valueIn', inputState.value, planType);
                          }}
                        />
                        }
                      </Grid.Column>
                      <Grid.Column width={5}>
                        { item.options && item.options.length &&
                        <Form.Dropdown
                          className="carrier-dropdown"
                          placeholder="Choose"
                          name={`${item.sysName}_OUT_${i}`}
                          search
                          fluid
                          selection
                          options={item.options}
                          value={item.valueOut}
                          onChange={(e, inputState) => {
                            changeField(i, j, 'benefits', 'valueOut', inputState.value, planType);
                          }}
                        /> ||
                        <Input
                          className="inline"
                          name={`${item.sysName}_OUT_${i}`}
                          id={`${item.sysName}_OUT_${i}`}
                          value={item.valueOut}
                          fluid
                          placeholder={item.placeholderOut}
                          onChange={(e, inputState) => {
                            changeField(i, j, 'benefits', 'valueOut', inputState.value, planType);
                          }}
                        />
                        }
                      </Grid.Column>
                    </Grid.Row>
                  )}
                  { (benefitPlan.rx && benefitPlan.rx.length > 0) &&
                  <Grid.Row className="rx-header-block">
                    <Grid.Column width={6} className="labelColumn" verticalAlign="middle">
                      <span>RX</span>
                    </Grid.Column>
                    <Grid.Column width={10} className="labelColumn" verticalAlign="middle">
                      <span> </span>
                    </Grid.Column>
                  </Grid.Row>
                  }
                  { (benefitPlan.rx && benefitPlan.rx.length > 0) &&
                  benefitPlan.rx.map((item, j) =>
                    <Grid.Row key={j} className="planInputRow rx-row">
                      <Grid.Column width={6} className="title-form" verticalAlign="middle">
                        <span>{item.name}</span>
                      </Grid.Column>
                      <Grid.Column width={10}>
                        <Input
                          id={item.sysName}
                          name={`${item.sysName}_${i}`}
                          value={item.value}
                          fluid
                          placeholder={item.placeholder}
                          onChange={(e, inputState) => {
                            changeField(i, j, 'rx', 'value', inputState.value, planType);
                          }}
                        />
                      </Grid.Column>
                    </Grid.Row>
                  )
                  }
                </Grid>
              </Grid.Column>
            </Grid.Row>
          );
        })}
      </Grid>
    );
  }
}

export default ProductMedicalBenefits;
