import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { Grid, Header, Input, Dropdown, Button, Icon } from 'semantic-ui-react';
import {
  CHANGE_COMMISSION,
  CHANGE_PAY_TYPE,
  CARRIERS,
  PREVIOUS_CARRIERS,
  OptionsPlanItem,
  PERCENTAGE,
  PEPM,
  DOLLARS,
} from '@benrevo/benrevo-react-rfp';
import { MEDICAL_SECTION, VISION_SECTION } from '../constants';

class ProductInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    carriersLoaded: PropTypes.bool.isRequired,
    section: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    payType: PropTypes.string.isRequired,
    tier: PropTypes.number.isRequired,
    maxOptions: PropTypes.number.isRequired,
    optionCount: PropTypes.number.isRequired,
    otherCarrier: PropTypes.object,
    virginCoverage: PropTypes.object.isRequired,
    years: PropTypes.array.isRequired,
    planList: PropTypes.array.isRequired,
    carriersList: PropTypes.array.isRequired,
    planNetworks: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]).isRequired,
    plans: PropTypes.array.isRequired,
    carriers: PropTypes.array.isRequired,
    carrierList: PropTypes.array.isRequired,
    previousCarriers: PropTypes.array.isRequired,
    commission: PropTypes.string.isRequired,
    updateForm: PropTypes.func.isRequired,
    updateCarrier: PropTypes.func.isRequired,
    changeTier: PropTypes.func.isRequired,
    removePlan: PropTypes.func.isRequired,
    addPlan: PropTypes.func.isRequired,
    updatePlan: PropTypes.func.isRequired,
    changeNetwork: PropTypes.func.isRequired,
    changeCarrier: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      adding: false,
    };

    this.changeForm = this.changeForm.bind(this);
  }

  changeForm(value, type) {
    this.props.updateForm(this.props.section, type, value);
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
      title,
      payType,
      years,
      tier,
      optionCount,
      maxOptions,
      virginCoverage,
      carriersList,
      updateCarrier,
      updatePlan,
      removePlan,
      changeNetwork,
      changeCarrier,
      changeTier,
      commission,
      carriers,
      previousCarriers,
      otherCarrier,
      carriersLoaded,
      plans,
      planList,
      planNetworks,
      carrierList,
  } = this.props;
    const blockCount = (!carriersLoaded || !otherCarrier);

    return (
      <Grid className="prequote-product">
        <Grid.Row>
          <Grid.Column width={16} textAlign="center">
            <Header as="h1" className="title1">{title} Information</Header>
            <div className="title1-description">
              Let{'\''}s go over everything you need to get a quote for your client
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as="h1" className="title2">REQUESTED COMMISSION SCHEDULE</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={6} only="computer" />
          <Grid.Column computer={10} tablet={16} mobile={16}>
            <Header as="h3" className="title-form">What is the commission rate?</Header>
            <Button.Group>
              <Button
                onClick={() => { this.changeForm(PERCENTAGE, CHANGE_PAY_TYPE); }}
                toggle
                active={payType === PERCENTAGE}
                size="medium"
              >{PERCENTAGE}</Button>
              <Button
                onClick={() => { this.changeForm(PEPM, CHANGE_PAY_TYPE); }}
                toggle
                active={payType === PEPM || payType === DOLLARS}
                size="medium"
              >{DOLLARS}</Button>
            </Button.Group>
            <Header as="h3" className="title-form">What is the commission rate?</Header>
            <NumberFormat
              customInput={Input}
              prefix={(payType === PEPM || payType === DOLLARS) ? '$' : ''}
              suffix={(payType === PERCENTAGE) ? '%' : ''}
              name="commission"
              placeholder={(payType === PEPM || payType === DOLLARS) ? '$' : '%'}
              value={commission}
              fluid
              onValueChange={(inputState) => { this.changeForm(inputState.value, CHANGE_COMMISSION); }}
            />
          </Grid.Column>
        </Grid.Row>
        { !virginCoverage[section] &&
          <Grid.Row>
            <Grid.Column width={16}>
              <Header as="h1" className="title2">CURRENT CARRIER</Header>
            </Grid.Column>
          </Grid.Row>
        }
        {!virginCoverage[section] &&
          <Grid.Row>
            <Grid.Column width={6} only="computer" />
            <Grid.Column computer={10} tablet={16} mobile={16}>
              <Header as="h3" className="title-form">Which carrier are you currently with?</Header>
              <Dropdown
                name={CARRIERS}
                placeholder="Select"
                selection
                options={carriersList}
                value={carriers[0].title}
                fluid
                onChange={(e, inputState) => { updateCarrier(section, CARRIERS, 'title', inputState.value, 0); }}
              />
              <Header as="h3" className="title-form">How many years have you been with them?</Header>
              <Dropdown
                name={CARRIERS}
                placeholder="Select a year"
                selection
                options={years}
                value={carriers[0].years}
                fluid
                onChange={(e, inputState) => { updateCarrier(section, CARRIERS, 'years', inputState.value, 0); }}
              />
            </Grid.Column>
          </Grid.Row>
        }
        {!virginCoverage[section] && section === MEDICAL_SECTION &&
          <Grid.Row>
            <Grid.Column width={16}>
              <Header as="h1" className="title2">PREVIOUS CARRIER</Header>
            </Grid.Column>
          </Grid.Row>
        }
        {!virginCoverage[section] && section === MEDICAL_SECTION &&
          <Grid.Row>
            <Grid.Column width={6} only="computer" />
            <Grid.Column computer={10} tablet={16} mobile={16}>
              <Header as="h3" className="title-form">Which carrier were you with previously?</Header>
              <Dropdown
                name={PREVIOUS_CARRIERS}
                placeholder="Select"
                selection
                options={carriersList}
                value={previousCarriers[0].title}
                fluid
                onChange={(e, inputState) => { updateCarrier(section, PREVIOUS_CARRIERS, 'title', inputState.value, 0); }}
              />
              <Header as="h3" className="title-form">How many years have you been with them?</Header>
              <Dropdown
                name={PREVIOUS_CARRIERS}
                placeholder="Select a year"
                selection
                options={years}
                value={previousCarriers[0].years}
                fluid
                onChange={(e, inputState) => { updateCarrier(section, PREVIOUS_CARRIERS, 'years', inputState.value, 0); }}
              />
            </Grid.Column>
          </Grid.Row>
        }
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as="h1" className="title2">Tiers</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={6} only="computer" />
          <Grid.Column computer={10} tablet={16} mobile={16}>
            <Header as="h3" className="title-form">How many rating  tiers are there?</Header>
            <Button.Group>
              <Button name="rfpButtonTier1" onClick={() => { changeTier(section, 1); }} toggle active={tier === 1} size="medium">1</Button>
              <Button name="rfpButtonTier2" onClick={() => { changeTier(section, 2); }} toggle active={tier === 2} size="medium">2</Button>
              <Button name="rfpButtonTier3" onClick={() => { changeTier(section, 3); }} toggle active={tier === 3} size="medium">3</Button>
              <Button name="rfpButtonTier4" onClick={() => { changeTier(section, 4); }} toggle active={tier === 4} size="medium">4</Button>
            </Button.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as="h1" className="title2">{title} Options</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={6} only="computer" />
          <Grid.Column computer={10} tablet={16} mobile={16}>
            <Header as="h3" className="title-form">How many incumbent medical plans do you have?</Header>
            <div className="count-control">
              <Button disabled={maxOptions === optionCount || blockCount} onClick={() => { this.addPlan(section); }} icon size="medium"><Icon name="plus" /></Button>
              <span className="indicator big">{ optionCount }</span>
              <Button disabled={optionCount === 1 || blockCount} onClick={() => { removePlan(section); }} icon size="medium"><Icon name="minus" /></Button>
            </div>
          </Grid.Column>
          <Grid.Column width={16}>
            <div className="separator">
              <span>Details</span>
            </div>
            <Grid>
              {plans.map(
                (item, i) => <OptionsPlanItem
                  key={i}
                  item={item}
                  planList={planList}
                  hideNetworks={section !== MEDICAL_SECTION}
                  hideTypes={section === VISION_SECTION}
                  index={i}
                  virgin={virginCoverage[section]}
                  section={section}
                  updatePlan={updatePlan}
                  carrierList={carrierList}
                  planNetworks={planNetworks}
                  changeCarrier={changeCarrier}
                  changeNetwork={changeNetwork}
                />
              )}
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default ProductInfo;
