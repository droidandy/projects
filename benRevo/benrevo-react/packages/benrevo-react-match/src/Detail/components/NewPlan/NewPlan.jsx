import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Grid } from 'semantic-ui-react';
import { CarrierLogo } from '@benrevo/benrevo-react-quote';
import DifferenceColumn from '../../../components/DifferenceColumn';
import PlansBenefitsDropdown from './../PlanBenefitsDropdown';
import PlanNameDropdown from './../PlanNameDropdown';

class NewPlan extends React.Component {
  static propTypes = {
    externalRX: PropTypes.bool,
    plan: PropTypes.object.isRequired,
    accordionClick: PropTypes.func.isRequired,
    accordionActiveIndex: PropTypes.array.isRequired,
    section: PropTypes.string.isRequired,
    alternativePlans: PropTypes.array.isRequired,
    quoteType: PropTypes.string,
    detailedPlan: PropTypes.object.isRequired,
    openModalClick: PropTypes.func.isRequired,
    multiMode: PropTypes.bool.isRequired,
    newPlan: PropTypes.object.isRequired,
    planIndex: PropTypes.number.isRequired,
    showRightVerticalDivider: PropTypes.bool,
    page: PropTypes.object.isRequired,
  };

  static defaultProps = {
    violationStatus: false,
    showRightVerticalDivider: false,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      plan,
      externalRX,
      accordionClick,
      accordionActiveIndex,
      section,
      alternativePlans,
      quoteType,
      detailedPlan,
      openModalClick,
      multiMode,
      newPlan,
      planIndex,
      showRightVerticalDivider,
      page,
    } = this.props;
    const options = [];
    if (alternativePlans && alternativePlans.length) {
      alternativePlans.forEach((planItem) => {
        options.push({ key: planItem.id, text: planItem.name, value: planItem.id });
      });
    }
    // console.log('newPlan props', this.props);
    return (
      <div className={`alternatives-table-column new ${multiMode ? 'big' : ''} ${showRightVerticalDivider ? 'v-divider' : ''}`}>
        <div className="table-header-row">
          <div className="row-header row-header-main header-column alt-table-column">
            <Grid columns={1}>
              <Grid.Row className="center-aligned logo-row">
                <div className="corner new">
                  <span>NEW</span>
                </div>
                { (page.carrier && page.carrier.carrier) &&
                <CarrierLogo carrier={page.carrier.carrier.displayName} section={section} quoteType={quoteType} />
                }
              </Grid.Row>
            </Grid>
            <Grid columns={1} className="plan-name-row">
              <Grid.Row className="center-aligned name centered">
                { !multiMode &&
                <PlanNameDropdown
                  openModalClick={openModalClick}
                  planIndex={planIndex}
                  alternativePlans={alternativePlans}
                  rfpQuoteOptionNetworkId={detailedPlan.rfpQuoteOptionNetworkId}
                  rfpQuoteNetworkPlanId={detailedPlan.rfpQuoteNetworkPlanId}
                  section={section}
                />
                }
                { (multiMode && detailedPlan.networkId) &&
                <PlansBenefitsDropdown
                  openModalClick={openModalClick}
                  networkId={detailedPlan.networkId}
                  section={section}
                  pnnId={newPlan.pnnId}
                />
                }
                { (multiMode && !detailedPlan.networkId) &&
                  <div>No network selected</div>
                }
              </Grid.Row>
            </Grid>
          </div>
        </div>
        { plan && (plan.cost && plan.cost.length > 0) &&
        <Accordion className="cost-accordion">
          <Accordion.Title active={accordionActiveIndex[0]} onClick={() => accordionClick(0)}>
            <div className="cost-title">
              <DifferenceColumn plan={plan} borderClass="" />
            </div>
          </Accordion.Title>
          <Accordion.Content active={accordionActiveIndex[0]}>
            <Grid className="cost-row-body">
              <Grid.Column className="alt-table-column white cost-body">
                {plan.cost.map((item, j) => {
                  if (item.name !== '% change from current') {
                    return (
                      <div className="cost-empty-item" key={j}>
                        <div className="short-line" />
                      </div>
                    );
                  }
                  return null;
                })}
              </Grid.Column>
            </Grid>
          </Accordion.Content>
        </Accordion>
        }
        { plan && (plan.benefits && plan.benefits.length > 0) &&
        <Accordion className={`benefits-accordion ${(externalRX) ? 'bottom' : ''}`}>
          <Accordion.Title active={accordionActiveIndex[1]} onClick={() => accordionClick(1)}>
            <div className="benefits-empty-head">IN-NETWORK</div>
            {section === 'medical' &&
              <Grid className="benefits-row-body">
              <Grid.Column className="alt-table-column white benefits-body">
                {plan.benefits.map((item, j) => {
                  if(j > 5){
                    return;
                  }
                  return (<div className="benefits-empty-item" key={j}>
                    <div className="short-line">-</div>
                  </div>)
                })}
              </Grid.Column>
            </Grid>
            }
          </Accordion.Title>
          <Accordion.Content active={accordionActiveIndex[1]}>
            <Grid className="benefits-row-body">
              <Grid.Column className="alt-table-column white benefits-body">
                {plan.benefits.map((item, j) => {
                  if(section === 'medical' && j <= 5){
                    return;
                  }
                  return (<div className="benefits-empty-item" key={j}>
                    <div className="short-line">-</div>
                  </div>)
                })}
              </Grid.Column>
            </Grid>
          </Accordion.Content>
        </Accordion>
        }
        { plan && (plan.rx && plan.rx.length > 0) &&
        <Accordion className="rx-accordion">
          <Accordion.Title active={accordionActiveIndex[2]} onClick={() => accordionClick(2)}>
            <div className="rx-empty-head big">
              {/* <Dropdown placeholder="Select RX Plan" selection options={plans} /> */}
            </div>
          </Accordion.Title>
          <Accordion.Content active={accordionActiveIndex[2]}>
            <div className="rx-empty-body">
              {plan.rx.map((item, j) =>
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

export default NewPlan;
