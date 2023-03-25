import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Grid, Image, Button } from 'semantic-ui-react';
import {
  SelectedDetails,
} from '@benrevo/benrevo-react-core';
import RowHeader from './../RowHeader';
import BenefitsBody from './../BenefitsBody';

class RxColumn extends React.Component {
  static propTypes = {
    section: PropTypes.string.isRequired,
    index: PropTypes.number,
    carrierName: PropTypes.string.isRequired,
    multiMode: PropTypes.bool.isRequired,
    carrier: PropTypes.object.isRequired,
    accordionActiveIndex: PropTypes.array.isRequired,
    plan: PropTypes.object.isRequired,
    deletePlan: PropTypes.func,
    bottomSeparatedBenefitsSysName: PropTypes.array.isRequired,
    onAddBenefits: PropTypes.func,
    addAlternativePlan: PropTypes.func.isRequired,
    accordionClick: PropTypes.func.isRequired,
    attributes: PropTypes.array.isRequired,
    quoteType: PropTypes.string.isRequired,
    onButtonClick: PropTypes.func,
    selectPlan: PropTypes.func.isRequired,
    rfpQuoteOptionNetworkId: PropTypes.number,
    rfpQuoteNetworkId: PropTypes.number,
    showFavourite: PropTypes.bool,
    changeFavourite: PropTypes.func.isRequired,
    removeAltPlanButton: PropTypes.bool,
    clearAltPlan: PropTypes.func,
    editBenefitInfo: PropTypes.func,
    showRightVerticalDivider: PropTypes.bool,
    setSelectedRxPlan: PropTypes.func.isRequired,
    selectedRxPlan: PropTypes.object,
    detailedPlanType: PropTypes.string,
    planTypeTemplates: PropTypes.object.isRequired,
  };

  static defaultProps = {
    rfpQuoteOptionNetworkId: null,
    rfpQuoteNetworkId: null,
    onButtonClick: null,
    deletePlan: null,
    showFavourite: false,
    index: null,
    removeAltPlanButton: false,
    editBenefitInfo: null,
    showRightVerticalDivider: false,
    onAddBenefits: () => {},
    clearAltPlan: () => {},
    selectedRxPlan: null,
    detailedPlanType: 'HMO',
  };

  constructor(props) {
    super(props);
    this.selectNtPlan = this.selectNtPlan.bind(this);
  }

  selectNtPlan(plan) {
    const {
      section,
      selectPlan,
      rfpQuoteOptionNetworkId,
      onButtonClick,
    } = this.props;
    // console.log('plan', plan, 'rfpQuoteOptionNetworkId', rfpQuoteOptionNetworkId);
    // section, rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, index, multiMode, carrier
    selectPlan(section, plan.rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, null, null, null);
    if (onButtonClick) onButtonClick();
  }

  addAltPlan(plan) {
    const { section, addAlternativePlan, onButtonClick } = this.props;
    addAlternativePlan(section, plan);

    if (onButtonClick) onButtonClick();
  }

  render() {
    const {
      carrier,
      carrierName,
      plan,
      section,
      deletePlan,
      attributes,
      bottomSeparatedBenefitsSysName,
      accordionClick,
      multiMode,
      onAddBenefits,
      accordionActiveIndex,
      quoteType,
      showFavourite,
      changeFavourite,
      rfpQuoteNetworkId,
      removeAltPlanButton,
      clearAltPlan,
      editBenefitInfo,
      showRightVerticalDivider,
      index, // plan index
      selectedRxPlan,
      setSelectedRxPlan,
      planTypeTemplates,
      detailedPlanType,
    } = this.props;
    // console.log('altRx column props', this.props);
    if (plan && Object.keys(plan).length > 0) {
      const selected = selectedRxPlan ? (selectedRxPlan.rfpQuoteNetworkPlanId === plan.rfpQuoteNetworkPlanId) : plan.selected;
      return (
        <div className={`alternatives-table-column rx-column ${plan.type} ${selected ? 'column-selected' : ''} ${showRightVerticalDivider ? 'v-divider' : ''}`}>
          <div className={`table-header-row ${carrier.carrier.name}`}>
            <RowHeader
              onAddBenefits={(state) => {
                onAddBenefits(state);
              }}
              deletePlan={deletePlan}
              network={false}
              section={section}
              attributes={attributes}
              plan={plan}
              multiMode={multiMode}
              carrier={carrier}
              quoteType={quoteType}
              showFavourite={showFavourite}
              changeFavourite={changeFavourite}
              rfpQuoteNetworkId={rfpQuoteNetworkId}
              index={index}
              removeAltPlanButton={removeAltPlanButton}
              clearAltPlan={clearAltPlan}
              editBenefitInfo={editBenefitInfo}
            />
          </div>
          <Accordion className="benefits-accordion bottom">
            <Accordion.Title active={accordionActiveIndex[4]} onClick={() => accordionClick(4)}>
              <Grid
                columns={1}
                className={`alt-table-column first-plan white ${plan.selected ? 'selected' : ''} ${plan.type}`}
                id="benefits-editing-anchor"
              >
                <Grid.Row className="center-aligned rx-row">
                  <Grid.Column />
                </Grid.Row>
              </Grid>
            </Accordion.Title>
            <Accordion.Content active={accordionActiveIndex[4]}>
              <Grid className="benefits-row-body">
                <Grid.Column
                  className={`alt-table-column white ${plan.selected ? 'selected' : ''} ${plan.type} benefits-body`}>
                  {plan.rx.map((item, j) =>
                    <BenefitsBody
                      item={item}
                      key={j}
                      bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
                      carrierName={carrierName}
                    />
                  )}
                </Grid.Column>
              </Grid>
            </Accordion.Content>
          </Accordion>
          {/* More, Less, BenefitsSummary, Selected blocks */}
          <div className="details">
            <Grid.Column className={`alt-table-column ${plan.selected ? 'selected' : ''} ${plan.type}`}>
              { (plan.type !== 'current' && !selected) &&
              <Grid.Row className="additional swap">
                { (this.props.index !== null) &&
                  <div className="additional-button">
                    <Button
                      fluid
                      onClick={() => {
                        setSelectedRxPlan(plan);
                      }}
                      size="medium"
                      primary
                      className="select-button select-footer"
                    >
                      Select Plan
                    </Button>
                  </div>
                }
              </Grid.Row>
              }
              { (plan.type === 'current') &&
              <Grid.Row className="additional more-less" onClick={() => accordionClick('open')}></Grid.Row>
              }
              { selected &&
              <Grid.Row className="additional selected">
                <Image src={SelectedDetails} />
                <span>Selected</span>
              </Grid.Row>
              }
            </Grid.Column>
          </div>
        </div>
      );
    }
    const emptyPlanTemplate = {};
    const rxDetailedPlanType = `RX_${detailedPlanType || 'HMO'}`;
    const tamplateRx = planTypeTemplates[rxDetailedPlanType] ? Object.values(planTypeTemplates[rxDetailedPlanType]) : [];
    emptyPlanTemplate.rx = [];
    tamplateRx.forEach((item) => {
      emptyPlanTemplate.rx.push(item);
    });
    return (
      <div className="alternatives-table-column current current-empty rx-column">
        <div className="table-header-row">
          <div className="row-header row-header-main header-column alt-table-column">
            <div className={editBenefitInfo ? 'logo-row edit-benefits' : 'logo-row'}>
              <span>No incumbent plan</span>
            </div>
            <div className="plan-name-row">
              <div className="long-line" />
              <div className="long-line" />
            </div>
          </div>
        </div>
        {(emptyPlanTemplate.rx && emptyPlanTemplate.rx.length > 0) &&
        <Accordion className="rx-accordion">
          <Accordion.Title active={accordionActiveIndex[4]} onClick={() => accordionClick(4)}>
            <div className="rx-empty-head">
              <div className="short-line" />
            </div>
          </Accordion.Title>
          <Accordion.Content active={accordionActiveIndex[4]}>
            <div className="rx-empty-body">
              {emptyPlanTemplate.rx && emptyPlanTemplate.rx.map((item, j) =>
                <div className="rx-empty-item" key={j}>
                  <div className="short-line" />
                </div>
              )}
            </div>
          </Accordion.Content>
        </Accordion>
        }
        {/* More, Less, BenefitsSummary, Selected blocks */}
        <div className="details">
          <Grid.Column className="alt-table-column">
            <div className="empty-footer" />
          </Grid.Column>
        </div>
      </div>
    );
  }
}

export default RxColumn;
