import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Grid, Image, Button } from 'semantic-ui-react';
import {
  LessDetails,
  DownloadBenefits,
  SelectedDetails,
  addNewPlanImg,
} from '@benrevo/benrevo-react-core';
import RXBody from '../RxBody';
import DifferenceColumn from './../DifferenceColumn';
import RowHeader from './../RowHeader';
import CostBody from './../CostBody';
import BenefitsHead from './../BenefitsHead';
import BenefitsBody from './../BenefitsBody';

class AlternativesColumn extends React.Component {
  static propTypes = {
    section: PropTypes.string.isRequired,
    index: PropTypes.number,
    carrierName: PropTypes.string.isRequired,
    multiMode: PropTypes.bool.isRequired,
    externalRX: PropTypes.bool,
    showBenefits: PropTypes.bool,
    showIntRX: PropTypes.bool,
    carrier: PropTypes.object.isRequired,
    accordionActiveIndex: PropTypes.array.isRequired,
    plan: PropTypes.object.isRequired,
    bottomSeparatedBenefitsSysName: PropTypes.array.isRequired,
    bottomSeparatedRxSysName: PropTypes.array.isRequired,
    downloadPlanBenefitsSummary: PropTypes.func.isRequired,
    onAddBenefits: PropTypes.func,
    addAlternativePlan: PropTypes.func.isRequired,
    accordionClick: PropTypes.func.isRequired,
    attributes: PropTypes.array.isRequired,
    quoteType: PropTypes.string.isRequired,
    planTemplate: PropTypes.object.isRequired,
    thirdColumn: PropTypes.bool,
    repalceButtons: PropTypes.bool,
    onButtonClick: PropTypes.func,
    selectPlan: PropTypes.func.isRequired,
    rfpQuoteOptionNetworkId: PropTypes.number,
    rfpQuoteNetworkId: PropTypes.number,
    showFavourite: PropTypes.bool,
    changeFavourite: PropTypes.func.isRequired,
    removeAltPlanButton: PropTypes.bool,
    editBenefitInfo: PropTypes.func,
    showRightVerticalDivider: PropTypes.bool,
    showExtRX: PropTypes.bool,
    setSelectedPlan: PropTypes.func,
    selectedMainPlan: PropTypes.object,
    hideAddAlt: PropTypes.bool,
    hideReplaceMatch: PropTypes.bool,
    optionName: PropTypes.string,
    isCurrentPlan: PropTypes.bool,
    unchangedSecondSelectedPlan: PropTypes.object.isRequired,
    unchangedSecondSelectedRxPlan: PropTypes.object.isRequired,
    unchangedFirstSelectedPlan: PropTypes.object.isRequired,
    unchangedFirstSelectedRxPlan: PropTypes.object.isRequired,
    planIndex: PropTypes.number,
  };

  static defaultProps = {
    isCurrentPlan: false,
    showBenefits: false,
    showIntRX: false,
    thirdColumn: false,
    repalceButtons: false,
    rfpQuoteOptionNetworkId: null,
    rfpQuoteNetworkId: null,
    onButtonClick: null,
    showFavourite: false,
    index: null,
    removeAltPlanButton: false,
    editBenefitInfo: null,
    showRightVerticalDivider: false,
    onAddBenefits: () => {},
    showExtRX: false,
    setSelectedPlan: () => {},
    selectedMainPlan: null,
    hideAddAlt: false,
    hideReplaceMatch: false,
    optionName: null,
    selectedPlan: {},
    planIndex: 0,
  };

  constructor(props) {
    super(props);
    this.selectNtPlan = this.selectNtPlan.bind(this);
    this.clearAltPlan = this.clearAltPlan.bind(this);
    this.setFirstSelectedPlan = this.setFirstSelectedPlan.bind(this);
  }

  setFirstSelectedPlan(plan) {
    const {
      section,
      selectPlan,
      rfpQuoteOptionNetworkId,
      multiMode,
      planIndex,
      removeAltPlanButton,
      onButtonClick,
    } = this.props;
    selectPlan(section, plan.rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, planIndex, multiMode, null);
    if (!removeAltPlanButton && onButtonClick) {
      onButtonClick();
    }
  }

  getRxSummary(plan) {
    if (!plan || !plan.rx || !plan.rx.length > 0) {
      return null;
    }
    let tier1 = null;
    let tier2 = null;
    let tier3 = null;
    let tier4 = null;
    plan.rx.forEach((item) => {
      if (item.sysName) {
        let val = null;
        if (item.value) {
          val = this.addTypeToValue(item.type, item.value);
        } else if (item.valueOut) {
          val = this.addTypeToValue(item.type, item.valueOut);
        }
        switch (item.sysName) {
          case 'MEMBER_COPAY_TIER_1':
            tier1 = val;
            break;
          case 'MEMBER_COPAY_TIER_2':
            tier2 = val;
            break;
          case 'MEMBER_COPAY_TIER_3':
            tier3 = val;
            break;
          case 'MEMBER_COPAY_TIER_4':
            tier4 = val;
            break;
          default:
            break;
        }
      }
    });

    const labels = [];
    const values = [tier1, tier2, tier3, tier4].filter((val, ind) => {
      if (val) {
        labels.push(`Tier ${ind + 1}`);
        return val;
      }
    }).join('/');

    return { tierLabels: labels.join('/'), values };
  }

  addTypeToValue(type, val) {
    if (type === 'DOLLAR') {
      return `$${val}`;
    } else if (type === 'PERCENT' && val !== 'N/A') {
      return `${val}%`;
    }
    return val;
  }

  clearAltPlan() {
    const {
      section,
      addAlternativePlan,
      rfpQuoteOptionNetworkId,
      unchangedSecondSelectedPlan,
      unchangedSecondSelectedRxPlan,
      planIndex,
      plan,
    } = this.props;
    // select second alternative plan
    if (unchangedSecondSelectedPlan.rfpQuoteNetworkPlanId) {
      addAlternativePlan(section, unchangedSecondSelectedPlan, unchangedSecondSelectedPlan.rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, 'unselect', planIndex);
    }
    if (unchangedSecondSelectedRxPlan.rfpQuoteNetworkPlanId) {
      addAlternativePlan(section, unchangedSecondSelectedRxPlan, unchangedSecondSelectedRxPlan.rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, 'unselect', planIndex);
    }
    if (!Object.values(unchangedSecondSelectedPlan).length && plan.rfpQuoteNetworkPlanId) {
      addAlternativePlan(section, plan, plan.rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, 'unselect', planIndex);
    }
  }

  addAltPlan(plan) {
    const { section, addAlternativePlan, onButtonClick, rfpQuoteOptionNetworkId, planIndex } = this.props;
    // select second alternative plan
    addAlternativePlan(section, plan, plan.rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, 'select', planIndex);
    if (onButtonClick) onButtonClick();
  }

  selectNtPlan() {
    const {
      section,
      selectPlan,
      rfpQuoteOptionNetworkId,
      onButtonClick,
      multiMode,
      removeAltPlanButton,
      unchangedFirstSelectedPlan,
      unchangedFirstSelectedRxPlan,
      unchangedSecondSelectedPlan,
      unchangedSecondSelectedRxPlan,
      planIndex,
    } = this.props;
    if (unchangedSecondSelectedPlan.rfpQuoteNetworkPlanId) selectPlan(section, unchangedSecondSelectedPlan.rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, planIndex, multiMode, null);
    if (unchangedSecondSelectedRxPlan.rfpQuoteNetworkPlanId) selectPlan(section, unchangedSecondSelectedRxPlan.rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, planIndex, multiMode, null);
    if (unchangedFirstSelectedPlan.rfpQuoteNetworkPlanId) this.addAltPlan(unchangedFirstSelectedPlan);
    if (unchangedFirstSelectedRxPlan.rfpQuoteNetworkPlanId) this.addAltPlan(unchangedFirstSelectedRxPlan);
    if (!removeAltPlanButton && onButtonClick) {
      onButtonClick();
    }
  }

  render() {
    const {
      carrier,
      carrierName,
      plan,
      externalRX,
      showBenefits,
      showIntRX,
      section,
      attributes,
      bottomSeparatedBenefitsSysName,
      bottomSeparatedRxSysName,
      downloadPlanBenefitsSummary,
      accordionClick,
      multiMode,
      onAddBenefits,
      accordionActiveIndex,
      quoteType,
      planTemplate,
      thirdColumn,
      repalceButtons,
      showFavourite,
      changeFavourite,
      rfpQuoteNetworkId,
      removeAltPlanButton,
      editBenefitInfo,
      showRightVerticalDivider,
      index, // plan index
      showExtRX,
      setSelectedPlan,
      selectedMainPlan,
      hideAddAlt,
      hideReplaceMatch,
      optionName,
      isCurrentPlan,
    } = this.props;
    if (showBenefits && (!plan.benefits || !plan.benefits.length)) {
      plan.benefits = planTemplate.benefits;
    }
    if (showIntRX && (!plan.rx || !plan.rx.length)) {
      plan.rx = planTemplate.rx;
    }
    // chech if this is a modalWindow mode or default mode by flag showFavourite
    const selected = (selectedMainPlan && showFavourite) ? (selectedMainPlan.rfpQuoteNetworkPlanId === plan.rfpQuoteNetworkPlanId) : plan.selected;
    const moreDetails = accordionActiveIndex[1] && ((showIntRX && !accordionActiveIndex[2]) || !showIntRX);
    const rxSummary = this.getRxSummary(plan);
    return (
      <div className={`alternatives-table-column ${plan.type} ${(selected && showFavourite) ? 'column-selected' : ''} ${showRightVerticalDivider ? 'v-divider' : ''}`}>
        <div className={`table-header-row ${carrier.carrier.name}`}>
          <RowHeader
            onAddBenefits={(state) => {
              onAddBenefits(state);
            }}
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
            clearAltPlan={this.clearAltPlan}
            editBenefitInfo={editBenefitInfo}
            optionName={optionName}
            isCurrentPlan={isCurrentPlan}
          />
        </div>
        {(plan.cost && plan.cost.length > 0) &&
        <Accordion className="cost-accordion">
          <Accordion.Title active={accordionActiveIndex[0]} onClick={() => accordionClick(0)}>
            <div className="cost-title">
              <DifferenceColumn plan={plan} borderClass="" />
            </div>
          </Accordion.Title>
          <Accordion.Content active={accordionActiveIndex[0]}>
            <div className={`cost-body ${plan.type} ${plan.selected ? 'selected' : ''}`}>
              <CostBody plan={plan} costClass="alt-table-column blue" />
            </div>
          </Accordion.Content>
        </Accordion>
        }
        {(plan.benefits && plan.benefits.length > 0) &&
        <Accordion className={`benefits-accordion ${(externalRX) ? 'bottom' : ''}`}>
          <Accordion.Title active={accordionActiveIndex[1]} onClick={() => accordionClick(1)}>
            <BenefitsHead planTemplate={plan} />
            {section === 'medical' &&
              <Grid className="benefits-row-body head-benefits">
              <Grid.Column className={`alt-table-column white ${plan.selected ? 'selected' : ''} ${plan.type} benefits-body`}>
                {plan.benefits.map((item, j) => {
                  if(j > 5){
                    return;
                  }
                  return <BenefitsBody item={item} key={j} bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName} carrierName={carrierName} />
                })}
              </Grid.Column>
            </Grid>
            }
          </Accordion.Title>
          <Accordion.Content active={accordionActiveIndex[1]}>
            <Grid className="benefits-row-body">
              <Grid.Column className={`alt-table-column white ${plan.selected ? 'selected' : ''} ${plan.type} benefits-body`}>
                {plan.benefits.map((item, j) => {
                  if(section === 'medical' && j <= 5){
                    return;
                  }
                  return <BenefitsBody item={item} key={j} bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName} carrierName={carrierName} />
                })}
              </Grid.Column>
            </Grid>
          </Accordion.Content>
        </Accordion>
        }
        {(plan.rx && plan.rx.length > 0 && !externalRX) &&
        <Accordion className="rx-accordion">
          <Accordion.Title active={accordionActiveIndex[2]} onClick={() => accordionClick(2)}>
            <Grid key="selected-rx" columns={2} className={`alt-table-column white ${plan.selected ? 'selected' : ''} ${plan.type}`}>
              <Grid.Row className="center-aligned rx-row big">
                {moreDetails && rxSummary &&
                  <Grid.Column className="sixteen wide rx-summary">
                    <div className="rx-summary-values">{rxSummary.values}</div>
                    <div className="rx-summary-labels">{rxSummary.tierLabels}</div>
                  </Grid.Column>
                }
              </Grid.Row>
            </Grid>
          </Accordion.Title>
          <Accordion.Content active={accordionActiveIndex[2]}>
            <RXBody
              plan={plan}
              rxClassName={`alt-table-column white ${plan.type}`}
              rxColumnClassName="one-col rx content-col"
              rxRowType="value"
              bottomSeparatedRxSysName={bottomSeparatedRxSysName}
            />
          </Accordion.Content>
        </Accordion>
        }
        {/* More, Less, BenefitsSummary, Selected blocks */}
        <div className="details">
          <Grid.Column className={`alt-table-column ${plan.selected ? 'selected' : ''} ${plan.type}`}>
            { moreDetails &&
            <Grid.Row className="additional more-less" onClick={() => accordionClick('close')}>
              <Image src={LessDetails} />
              <span>LESS DETAILS</span>
            </Grid.Row>
            }
            { !moreDetails &&
            <Grid.Row className="additional more-less" onClick={() => accordionClick('open')}>
              <Image src={addNewPlanImg} />
              <span>MORE BENEFITS</span>
            </Grid.Row>
            }
            { (!multiMode && plan.type !== 'current' && plan.summaryFileLink && plan.summaryFileLink.length > 0) &&
            <Grid.Row className="additional summary" onClick={() => downloadPlanBenefitsSummary(plan.summaryFileLink, plan.name)}>
              <Image src={DownloadBenefits} />
              <span>BENEFITS SUMMARY</span>
            </Grid.Row>
            }
            { !isCurrentPlan && thirdColumn && !selected && plan.type !== 'current' &&
            <Grid.Row className="additional swap">
              { !repalceButtons &&
              <div className="additional-button">
                <Button fluid onClick={() => { this.selectNtPlan(); }} size="medium" primary className="select-button select-footer">Swap Plans</Button>
              </div>
              }
              { (!hideAddAlt && repalceButtons && !externalRX) &&
              <div className="additional-button add-alternative">
                <Button fluid onClick={() => { this.addAltPlan(plan); }} size="medium" primary className="select-button select-footer">Add Alternative</Button>
              </div>
              }
              { (!hideReplaceMatch && !showExtRX && repalceButtons) &&
              <div className="additional-button replace-match">
                <Button fluid onClick={() => { this.setFirstSelectedPlan(plan); }} size="medium" primary className="select-button select-footer">Replace Match</Button>
              </div>
              }
              { showExtRX &&
              <div className="additional-button">
                <Button fluid onClick={() => { setSelectedPlan(plan); }} size="medium" primary className="select-button select-footer">Select Plan</Button>
              </div>
              }
            </Grid.Row>
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
}

export default AlternativesColumn;
