import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Grid, Button, Image } from 'semantic-ui-react';
import { selectedIcon, selectedMatchIcon } from '@benrevo/benrevo-react-core';
import { FormattedNumber } from 'react-intl';
import CarrierLogo from './../../CarrierLogo';
import RowHeader from './RowHeader';
import DifferenceColumn from './DifferenceColumn';
import CostBody from './CostBody';
import BenefitsHead from './BenefitsHead';
import BenefitsBody from './BenefitsBody';
import RXBody from './RXBody';

class AlternativesColumn extends React.Component {
  static propTypes = {
    section: PropTypes.string.isRequired,
    motionLink: PropTypes.string,
    carrierName: PropTypes.string,
    multiMode: PropTypes.bool.isRequired,
    externalRX: PropTypes.bool.isRequired,
    showCost: PropTypes.array.isRequired,
    showBenefits: PropTypes.bool.isRequired,
    showIntRX: PropTypes.bool.isRequired,
    hasSelected: PropTypes.number,
    carrier: PropTypes.object.isRequired,
    activeIndex: PropTypes.array.isRequired,
    plan: PropTypes.object.isRequired,
    deletePlan: PropTypes.func.isRequired,
    bottomSeparatedBenefitsSysName: PropTypes.array.isRequired,
    bottomSeparatedRxSysName: PropTypes.array.isRequired,
    downloadPlanBenefitsSummary: PropTypes.func.isRequired,
    onAddBenefits: PropTypes.func.isRequired,
    accordionClick: PropTypes.func.isRequired,
    editPlan: PropTypes.func.isRequired,
    setBorderColor: PropTypes.func.isRequired,
    selectNtPlan: PropTypes.func.isRequired,
    attributes: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    currentTotal: PropTypes.number,
    optionName: PropTypes.string,
  };

  render() {
    const {
      carrier,
      motionLink,
      carrierName,
      plan,
      externalRX,
      showCost,
      showBenefits,
      showIntRX,
      section,
      deletePlan,
      editPlan,
      attributes,
      bottomSeparatedBenefitsSysName,
      bottomSeparatedRxSysName,
      downloadPlanBenefitsSummary,
      accordionClick,
      index,
      multiMode,
      onAddBenefits,
      setBorderColor,
      selectNtPlan,
      activeIndex,
      currentTotal,
      hasSelected,
      optionName,
    } = this.props;
    return (
      <div className="alternatives-table-column">
        <div className={`table-header-row ${carrier.carrier.name}`}>
          <RowHeader
            onAddBenefits={(state) => {
              onAddBenefits(state);
            }}
            deletePlan={deletePlan}
            network={false}
            section={section}
            attributes={attributes}
            downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
            additionalClassName={`${setBorderColor(plan)} first-plan`}
            plan={plan}
            editPlan={() => editPlan(index)}
            multiMode={multiMode}
            carrier={carrier}
            optionName={optionName}
          />
        </div>
        {showCost &&
          <Accordion defaultActiveIndex={0}>
            <Accordion.Title active={activeIndex[0]} onClick={() => accordionClick(0)}>
              <div className="cost-title">
                <DifferenceColumn plan={plan} borderClass={setBorderColor(plan)} />
              </div>
            </Accordion.Title>
            <Accordion.Content active={activeIndex[0]}>
              <div className="cost-body">
                <CostBody plan={plan} costClass={`alt-table-column blue ${setBorderColor(plan)} ${plan.selected ? 'selected' : ''} ${plan.type}`} />
              </div>
            </Accordion.Content>
          </Accordion>
        }
        {showBenefits &&
        <Accordion defaultActiveIndex={0} className={`benefits-accordion ${(externalRX) ? 'bottom' : ''}`}>
          <Accordion.Title active={activeIndex[1]} onClick={() => accordionClick(1)}>
            <BenefitsHead planTemplate={plan} setBorderColor={setBorderColor} />
          </Accordion.Title>
          <Accordion.Content active={activeIndex[1]}>
            <Grid className="benefits-row-body">
              <div className="benefits-body">
                <Grid.Column className={`alt-table-column white ${setBorderColor(plan)} ${plan.selected ? 'selected' : ''} ${plan.type}`}>
                  {plan.benefits.map((item, j) =>
                    <BenefitsBody item={item} key={j} bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName} motionLink={motionLink} carrierName={carrierName} />
                  )}
                </Grid.Column>
              </div>
            </Grid>
          </Accordion.Content>
        </Accordion>
        }
        {showIntRX &&
          <Accordion defaultActiveIndex={0}>
            <Accordion.Title active={activeIndex[2]} onClick={() => accordionClick(2)}>
              <Grid key="selected-rx" columns={2} className={`alt-table-column white ${setBorderColor(plan)} ${plan.selected ? 'selected' : ''} ${plan.type}`}>
                <Grid.Row className="center-aligned benefits-row">
                  <Grid.Column />
                </Grid.Row>
              </Grid>
            </Accordion.Title>
            <Accordion.Content active={activeIndex[2]}>
              <Grid className="rx-row-body">
                <RXBody
                  plan={plan}
                  rxClassName={`alt-table-column white ${setBorderColor(plan)} ${plan.selected ? 'selected' : ''} ${plan.type}`}
                  rxColumnClassName={'on-col-rx content-col'}
                  rxRowType={'value'}
                  bottomSeparatedRxSysName={bottomSeparatedRxSysName}
                />
              </Grid>
            </Accordion.Content>
          </Accordion>
        }
        <div className="total">
          <div className="total-row-body">
            <div className="total">
              {!externalRX &&
                <Grid.Column key="selected-total" className={`alt-table-column ${setBorderColor(plan)} ${plan.selected ? 'selected' : ''} ${plan.type}`}>
                  <Grid.Row className="center-aligned total-row big logo-row">
                    {plan.type === 'matchPlan' &&
                    <div className="corner match">
                      <span>MATCH</span>
                    </div>
                    }
                    { plan.carrier &&
                    <CarrierLogo carrier={plan.carrier} section={section} />
                    }
                  </Grid.Row>
                  <Grid.Row className="center-aligned total-row big plan-name-row">
                    {plan.name}
                  </Grid.Row>
                  <Grid.Row className="center-aligned total-row percent">
                    { plan.type !== 'current' &&
                      <FormattedNumber
                        style="percent" // eslint-disable-line react/style-prop-object
                        minimumFractionDigits={0}
                        maximumFractionDigits={1}
                        value={(plan.total > 0 && hasSelected) ? ((plan.total - currentTotal) / currentTotal) : 0}
                      />
                    }
                    { plan.type === 'current' && '-' }
                  </Grid.Row>
                  <Grid.Row className="center-aligned total-row">
                    <FormattedNumber
                      style="currency" // eslint-disable-line react/style-prop-object
                      currency="USD"
                      minimumFractionDigits={2}
                      maximumFractionDigits={2}
                      value={(plan.total) ? plan.total : 0}
                    />
                  </Grid.Row>
                  <Grid.Row className={`center-aligned total-row ${plan.selected ? 'selected-label' : ''} last-row`}>
                    { plan.selected &&
                    <div className="selected">
                      {plan.type === 'matchPlan' &&
                      <Image className="icon-selected" src={selectedMatchIcon} />
                      }
                      {plan.type !== 'matchPlan' &&
                      <Image className="icon-selected" src={selectedIcon} />
                      }
                      Selected
                    </div>
                    }
                    { !plan.selected && plan.type !== 'current' &&
                    <Button onClick={() => { selectNtPlan(plan); }} size="medium" primary className="select-button select-footer">
                      Select Plan
                    </Button>
                    }
                  </Grid.Row>
                </Grid.Column>
              }
              {externalRX &&
                <Grid.Column key="selected-external-total" className={`alt-table-column ${setBorderColor(plan)} ${plan.selected ? 'selected' : ''} ${plan.type}`}>
                  <Grid.Row className={`center-aligned total-row ${plan.selected ? 'selected-label' : ''} last-row`}>
                    { plan.selected &&
                    <div className="selected">
                      {plan.type === 'matchPlan' &&
                      <Image className="icon-selected" src={selectedMatchIcon} />
                      }
                      {plan.type !== 'matchPlan' &&
                      <Image className="icon-selected" src={selectedIcon} />
                      }
                      Selected
                    </div>
                    }
                    { !plan.selected && plan.type !== 'current' &&
                    <Button onClick={() => { selectNtPlan(plan); }} size="medium" primary className="select-button select-footer">
                      Select Plan
                    </Button>
                    }
                  </Grid.Row>
                </Grid.Column>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AlternativesColumn;
