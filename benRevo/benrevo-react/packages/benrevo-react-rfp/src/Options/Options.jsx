/*
*
* Options
*
*/

import React from 'react';
import Helmet from 'react-helmet';
import { Grid, Segment, Header, Button, Divider, Icon} from 'semantic-ui-react';
import FormBase from '../FormBaseClass';
import { validateOptions } from '../FormValidator';
import OptionsPlanItem from './components/OptionsPlanItem';

class Options extends FormBase { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      adding: false,
    };
  }

  componentWillMount() {
    const { plansLoaded } = this.props;

    if (plansLoaded) {
      this.setOtherOptions();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { changeCarrier, section, virginCoverage, otherCarrier, plans } = nextProps;
    if (this.state.adding) {
      this.setState({ adding: false }, () => {
        if (virginCoverage[section]) {
          const lastPlan = plans[plans.length - 1];
          changeCarrier(section, otherCarrier.id || otherCarrier.carrierId, plans.length - 1, lastPlan.title, true);
        }
      });
    }

    if (nextProps.plansLoaded && !this.props.plansLoaded && otherCarrier) {
      this.setOtherOptions(nextProps);
    }

    if (nextProps.otherCarrier && !this.props.otherCarrier && this.props.plansLoaded) {
      this.setOtherOptions(nextProps);
    }
  }

  setOtherOptions(props = this.props) {
    const { changeCarrier, section, virginCoverage, otherCarrier, plans } = props;

    if (virginCoverage[section]) {
      for (let i = 0; i < plans.length; i += 1) {
        const plan = plans[i];

        changeCarrier(section, otherCarrier.id || otherCarrier.carrierId, plans.length - 1, plan.title, true);
      }
    }
  }

  runValidator() {
    return validateOptions(this.props, this.props.section);
  }

  addPlan(section) {
    const { addPlan } = this.props;

    this.setState({ adding: true }, () => {
      addPlan(section);
    });
  }

  render() {
    const {
      section,
      hideButtons,
      hideTitle,
      withoutVirgin,
      virginCoverage,
      maxOptions,
      changeTier,
      planList, plans, tier, optionCount,
      removePlan, updatePlan, carrierList, planNetworks,
      changeCarrier, changeNetwork, otherCarrier,
    } = this.props;
    const blockCount = (!otherCarrier) && !withoutVirgin;
    return (
      <div>
          <Helmet
            title="Options"
            meta={[
            { name: 'description', content: 'Description of Options' },
          ]}
          />
        <Grid stackable columns={2} as={Segment} className="gridSegment">
          {!hideTitle &&
            <Grid.Row>
              <Grid.Column width={16} textAlign="center">
                <Header as="h1"
                        className="rfpPageHeading">{section} RFP {!virginCoverage[section] ? 'Current' : ''} Options</Header>
              </Grid.Column>
              <Grid.Column width={16} textAlign="center">
                <Header as="h2" className="rfpPageSubHeading">Lets talk about the plans you are on </Header>
              </Grid.Column>
            </Grid.Row>
          }
          <Grid.Row>
            <Grid.Column width={5}>
              <Header as="h3" className="rfpPageSectionHeading">Tiers</Header>
            </Grid.Column>
            <Grid.Column width={11}>
              <Header as="h3" className="rfpPageFormSetHeading">{virginCoverage[section] ? 'Rating tier structure to be quoted' : 'How many ratings tiers are there?'}</Header>

              <Button.Group className="rfpButtonGroup rfpButtonGroup-tier rfpBlock">
                <Button name="rfpButtonTier1" onClick={() => { changeTier(section, 1); }} toggle active={tier == "1"} size="medium">1</Button>
                <Button name="rfpButtonTier2" onClick={() => { changeTier(section, 2); }} toggle active={tier == "2"} size="medium">2</Button>
                <Button name="rfpButtonTier3" onClick={() => { changeTier(section, 3); }} toggle active={tier == "3"} size="medium">3</Button>
                <Button name="rfpButtonTier4" onClick={() => { changeTier(section, 4); }} toggle active={tier == "4"} size="medium">4</Button>
              </Button.Group>
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row>
            <Grid.Column width={5}>
              <Header as="h3" className="rfpPageSectionHeading"> {section} Options</Header>
            </Grid.Column>
            <Grid.Column width={8}>
              <Header as="h3" className="rfpPageFormSetHeading">{virginCoverage[section] ? 'Which plan types would you like quoted?' : `How many incumbent ${section} plans do you have?`}</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16} textAlign="center">
              <div className="count-control rfpBlock">
                <Button disabled={maxOptions === optionCount || blockCount} onClick={() => { this.addPlan(section); }} icon size="medium"><Icon name='plus' /></Button>
                <span className="indicator big">{ optionCount }</span>
                <Button disabled={optionCount === 1 || blockCount} onClick={() => { removePlan(section); }} icon size="medium"><Icon name='minus' /></Button>
              </div>
              <div className="rfpSeparate">
                <span>Details</span>
              </div>
            </Grid.Column>
            <Divider />
          </Grid.Row>
          {plans.map(
            (item, i) => {
              return <OptionsPlanItem
                key={i}
                item={item}
                planList={planList}
                index={i}
                virgin={virginCoverage[section]}
                section={section}
                updatePlan={updatePlan}
                carrierList={carrierList}
                planNetworks={planNetworks}
                changeCarrier={changeCarrier}
                changeNetwork={changeNetwork}
              />
            }
          )}
          <Divider />
          {!hideButtons &&
            <Grid.Row>
              <div className="pageFooterActions">
                <Button onClick={() => { this.saveInformationSection('next'); }} primary floated={'right'} size="big">Save & Continue</Button>
                <Button onClick={() => { this.changePage('back'); }} floated={'left'} size="big" basic>Back</Button>
              </div>
            </Grid.Row>
          }
        </Grid>
      </div>
    );
  }
}

Options.propTypes = {};

export default Options;
