import React from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Header, Dropdown, Loader, Image, Button } from 'semantic-ui-react';
import { AlternativesCounter, ATTRIBUTES_CONTRACT_LENGTH } from '@benrevo/benrevo-react-quote';
import { exportIcon } from '@benrevo/benrevo-react-core';
import FirstColumn from './../FirstColumn';
import AlternativesColumn from './../AlternativesColumn';
import CarriersFilter from './../CarriersFilter';
import FirstLifeColumn from './../FirstLifeColumn';
import LifeStdLtdColumn from './../LifeStdLtdColumn';
import {
  MEDICAL_SECTION,
  DENTAL_SECTION,
  VISION_SECTION,
  LIFE_SECTION,
  STD_SECTION,
  LTD_SECTION,
  VOL_LIFE_SECTION,
  VOL_STD_SECTION,
  VOL_LTD_SECTION,
  bottomSeparatedBenefitsSysName,
  bottomSeparatedRxSysName,
} from './../../constants';
// import FirstColumn from './../components/FirstColumn';

class SectionPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    clientId: PropTypes.string.isRequired,
    detailedPlan: PropTypes.object,
    allPlansToCompare: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    allOptionsToCompare: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    getPlansTemplates: PropTypes.func.isRequired,
    planTypeTemplates: PropTypes.object,
    sectionSelected: PropTypes.string.isRequired,
    changeSelectedSection: PropTypes.func.isRequired,
    clientPlans: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]).isRequired,
    clientPlanSelected: PropTypes.number,
    changeSelectedClientPlanId: PropTypes.func.isRequired,
    clientPlanCarriersSelected: PropTypes.array.isRequired,
    changeSelectedClientPlanCarrier: PropTypes.func.isRequired,
    getPlansListForFilterCompare: PropTypes.func.isRequired,
    clientPlansLoading: PropTypes.bool.isRequired,
    updateComparePlansList: PropTypes.func.isRequired,
    // smallWidth: PropTypes.bool,
    // planFilterChanged: PropTypes.bool,
    downloadComparePlansList: PropTypes.func.isRequired,
  };

  static defaultProps = {
    allPlansToCompare: [],
    allOptionsToCompare: [],
    // allRx: [],
    planTemplate: {},
    planTypeTemplates: {},
    detailedPlan: {},
    currentPlan: {},
    smallWidth: false,
    planFilterChanged: false,
  };

  constructor(props) {
    super(props);
    this.changeSelectedSection = this.changeSelectedSection.bind(this);
    this.changeSelectedClientPlanId = this.changeSelectedClientPlanId.bind(this);
    this.changeSelectedClientPlanCarrier = this.changeSelectedClientPlanCarrier.bind(this);
    this.updateComparePlansList = this.updateComparePlansList.bind(this);
    this.accordionClick = this.accordionClick.bind(this);
    this.exportExcel = this.exportExcel.bind(this);
    this.checkAncillary = this.checkAncillary.bind(this);
    this.getCount = this.getCount.bind(this);
    this.changeSlider = this.changeSlider.bind(this);

    let isIE = false;

    if (navigator.appName === 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/))) {
      isIE = true;
    }

    this.productsOptions = [
      { key: MEDICAL_SECTION, text: 'Medical', value: 'MEDICAL' },
      { key: DENTAL_SECTION, text: 'Dental', value: 'DENTAL' },
      { key: VISION_SECTION, text: 'Vision', value: 'VISION' },
      { key: LIFE_SECTION, text: 'Life', value: 'LIFE' },
      { key: STD_SECTION, text: 'Std', value: 'STD' },
      { key: LTD_SECTION, text: 'Ltd', value: 'LTD' },
      /* { key: VOL_LIFE_SECTION, text: 'Vol_life', value: 'VOL_LIFE' },
      { key: VOL_STD_SECTION, text: 'Vol_std', value: 'VOL_STD' },
      { key: VOL_LTD_SECTION, text: 'Vol_ltd', value: 'VOL_LTD' }, */
    ];

    this.state = {
      alternativesCount: props.allPlansToCompare ? props.allPlansToCompare.length : 0,
      accordionActiveIndex: [false, true, false, false, true],
      count: 0,
      mainIndex: 0,
      currentPlanIndex: 0,
      isIE,
      ancillary: false,
    };
  }

  componentWillMount() {
    const {
      getPlansListForFilterCompare,
      clientId,
      sectionSelected,
      getPlansTemplates,
    } = this.props;
    getPlansListForFilterCompare(clientId);
    getPlansTemplates(sectionSelected);
  }

  componentDidMount() {
    window.addEventListener('resize', this.getCount);
    this.getCount(this.props);
    this.checkAncillary(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.allPlansToCompare.length !== this.props.allPlansToCompare.length) {
      this.setState({ alternativesCount: nextProps.allPlansToCompare.length }, () => {
        this.getCount(nextProps);
      });
    }
    // update comarePlans if filter was changed
    if (nextProps.planFilterChanged) {
      this.updateComparePlansList();
    }
    this.checkAncillary(nextProps);
  }

  getCount(props) {
    const { smallWidth } = props;
    const { currentPlanIndex, ancillary } = this.state;
    const small = window.innerWidth < (smallWidth || 1200);
    let count = 0;
    const mainIndex = 0;
    const rxIndex = 0;
    if (this.mainListInner) {
      this.mainListInner.style.transform = 'translate(0px, 0px)';
      // this.mainListInner.style.width = `${this.state.alternativesCount * 200}px`;
    }
    if (this.rxListInner) {
      this.rxListInner.style.transform = 'translate(0px, 0px)';
      // this.rxListInner.style.width = `${this.state.alternativesRxCount * 200}px`;
    }
    if (ancillary) {
      count = currentPlanIndex === null ? 2 : 2;
    }
    if (!ancillary) {
      if (small) {
        count = currentPlanIndex === null ? 4 : 3;
      } else {
        count = currentPlanIndex === null ? 5 : 4;
      }
    }
    this.setState({ count, mainIndex });
    if (this.counter) { // eslint-disable-line react/no-string-refs
      this.counter.setCount(count, mainIndex); // eslint-disable-line react/no-string-refs
      this.counter.clear(); // eslint-disable-line react/no-string-refs
      if (this.counterRX) { // eslint-disable-line react/no-string-refs
        this.counterRX.setCount(count, rxIndex); // eslint-disable-line react/no-string-refs
        this.counterRX.clear(); // eslint-disable-line react/no-string-refs
      }
    }
    if (this.sliderHeader) this.leftMove(null, null, true);
    if (this.sliderExtRXHeader) this.leftMoveRx(null, null, true);

    // if (this.scrollBar) this.scrollBar.setScrollTop(0);

    this.updateProps = false;
  }

  getAttributes() {
    const plans = this.props.allPlansToCompare;
    const attributes = {};
    if (plans && plans.length) {
      for (let i = 0; i < plans.length; i += 1) {
        const plan = plans[i];
        if (plan.attributes && plan.attributes.length) {
          for (let j = 0; j < plan.attributes.length; j += 1) {
            const attribute = plan.attributes[j];
            if (attribute.sysName === ATTRIBUTES_CONTRACT_LENGTH) {
              attributes[attribute.sysName] = attribute.name;
            }
          }
        }
      }
    }
    return attributes;
  }

  checkAncillary(props) {
    let ancillary = false;
    if (props.sectionSelected !== 'MEDICAL' && props.sectionSelected !== 'DENTAL' && props.sectionSelected !== 'VISION') {
      ancillary = true;
    }
    this.setState({ ancillary });
  }

  leftMove = (e, target, notUpdateCounter) => {
    const { isIE } = this.state;
    if (this.state.mainIndex === 0) return;
    let mainIndex = this.state.mainIndex - this.state.count;
    if (mainIndex < 0) mainIndex = 0;

    if (!notUpdateCounter) this.counter.updateCount('prev'); // eslint-disable-line react/no-string-refs

    this.setState({ mainIndex });

    if (!isIE) this.changeSlider(mainIndex);
  };

  rightMove = () => {
    const { alternativesCount, isIE } = this.state;
    let mainIndex = this.state.mainIndex + this.state.count;
    if (mainIndex >= alternativesCount && alternativesCount - mainIndex <= this.state.count) {
      mainIndex -= this.state.count;
      return;
    } else if (mainIndex > alternativesCount) mainIndex = alternativesCount;

    this.counter.updateCount('next'); // eslint-disable-line react/no-string-refs

    this.setState({ mainIndex });

    if (!isIE) this.changeSlider(mainIndex);
  };

  changeSlider(mainIndex) {
    const { ancillary } = this.state;
    if (this.mainListInner) {
      this.mainListInner.style.transform = `translate(-${(ancillary ? 300 : 200) * (mainIndex)}px, 0px)`;
      console.log('this.mainListInner.style.transform', this.mainListInner.style.transform);
    }
  }

  changeSelectedSection(value) {
    const {
      changeSelectedSection,
    } = this.props;
    changeSelectedSection(value);
  }

  changeSelectedClientPlanId(value) {
    const {
      changeSelectedClientPlanId,
    } = this.props;
    changeSelectedClientPlanId(value);
    // this.updateComparePlansList();
  }

  changeSelectedClientPlanCarrier(carriersSelected) {
    const {
      changeSelectedClientPlanCarrier,
    } = this.props;
    changeSelectedClientPlanCarrier(carriersSelected);
    // this.updateComparePlansList();
  }

  updateComparePlansList() {
    const {
      updateComparePlansList,
      sectionSelected,
      clientPlanSelected,
      clientPlanCarriersSelected,
      clientId,
    } = this.props;
    if (clientPlanSelected) {
      updateComparePlansList(sectionSelected, clientPlanCarriersSelected, clientPlanSelected, clientId);
    }
  }

  accordionClick(index) {
    const { accordionActiveIndex } = this.state;
    if (index === 'open') {
      accordionActiveIndex[0] = true;
      accordionActiveIndex[1] = true;
      accordionActiveIndex[2] = true;
      accordionActiveIndex[3] = true;
    }
    if (index === 'close') {
      accordionActiveIndex[1] = false;
      accordionActiveIndex[2] = false;
    }
    if (index === 'all') {
      accordionActiveIndex[2] = !accordionActiveIndex[2];
      accordionActiveIndex[3] = !accordionActiveIndex[3];
    }
    if (index !== 'all' && index !== 'open' && index !== 'close') {
      accordionActiveIndex[index] = !accordionActiveIndex[index];
    }
    this.setState({ accordionActiveIndex });
  }

  exportExcel() {
    const {
      downloadComparePlansList,
      sectionSelected,
      clientPlanSelected,
      clientPlanCarriersSelected,
      clientId,
    } = this.props;
    if (clientPlanSelected) {
      downloadComparePlansList(sectionSelected, clientPlanCarriersSelected, clientPlanSelected, clientId);
    }
  }

  render() {
    const {
      accordionActiveIndex,
      count,
      isIE,
      mainIndex,
      alternativesCount,
      ancillary,
    } = this.state;
    const {
      allPlansToCompare,
      planTypeTemplates,
      sectionSelected,
      clientPlans,
      clientPlanSelected,
      clientPlansLoading,
      allOptionsToCompare,
      detailedPlan,
    } = this.props;
    const options = {
      handlers: ['click-rail', 'drag-thumb', 'keyboard', 'touch'],
      wheelPropagation: false,
    };
    const attributes = this.getAttributes();
    // const showCost = (allPlansToCompare && allPlansToCompare[0] && allPlansToCompare[0].cost && allPlansToCompare[0].cost.length > 0);
    const showBenefits = (allPlansToCompare && allPlansToCompare[0] && allPlansToCompare[0].benefits && allPlansToCompare[0].benefits.length > 0);
    const showIntRX = (allPlansToCompare && allPlansToCompare[0] && allPlansToCompare[0].rx && allPlansToCompare[0].rx.length > 0);
    const clientPlansOptions = [];
    if (clientPlans && clientPlans.length) {
      clientPlans.forEach((clientPlan) => {
        if ((sectionSelected === 'MEDICAL' && (clientPlan.planType === 'HMO' || clientPlan.planType === 'PPO' || clientPlan.planType === 'HSA')) ||
          (sectionSelected === 'DENTAL' && (clientPlan.planType === 'DPPO' || clientPlan.planType === 'DHMO')) ||
          (sectionSelected === 'VISION' && clientPlan.planType === 'VISION') ||
          (sectionSelected === 'LIFE' && clientPlan.planType === 'LIFE') ||
          (sectionSelected === 'VOL_LIFE' && clientPlan.planType === 'VOL_LIFE') ||
          (sectionSelected === 'STD' && clientPlan.planType === 'STD') ||
          (sectionSelected === 'VOL_STD' && clientPlan.planType === 'VOL_STD') ||
          (sectionSelected === 'LTD' && clientPlan.planType === 'LTD') ||
          (sectionSelected === 'VOL_LTD' && clientPlan.planType === 'VOL_LTD')
        ) {
          clientPlansOptions.push({
            key: clientPlan.client_plan_id,
            text: `${clientPlan.planType} - ${clientPlan.planName}`,
            value: clientPlan.client_plan_id
          });
        }
      });
    }
    const planTemplate = (allPlansToCompare && allPlansToCompare.length) ? allPlansToCompare[0] : {};
    // console.log('compare', this.props, 'clientPlansOptions', clientPlansOptions);
    // console.log('compare state', this.state);
    const section = sectionSelected.toLowerCase();
    const comparePageClass = `${ancillary ? 'ancillary' : ''} presentation-compare alternatives-short`;
    return (
      <div className={comparePageClass}>
        <div>
          <Header className="presentation-options-header" as="h2">Compare Plans</Header>
          <Button primary size="tiny" className="excel-export" onClick={() => this.exportExcel()}>
            <Image src={exportIcon} />
            Export Excel
          </Button>
        </div>
        <div className="presentation-alternatives-actions">
          <div className="filters left-block">
            { (this.productsOptions && this.productsOptions.length > 0) &&
            <Dropdown
              selectOnBlur={false}
              value={sectionSelected}
              onChange={(e, inputState) => {
                this.changeSelectedSection(inputState.value);
              }}
              placeholder="Choose product"
              selection
              options={this.productsOptions}
            />
            }
            { (clientPlansOptions && clientPlansOptions.length > 0) &&
            <Dropdown
              selectOnBlur={false}
              value={clientPlanSelected}
              onChange={(e, inputState) => {
                this.changeSelectedClientPlanId(inputState.value);
              }}
              placeholder="Choose client's plan"
              selection
              options={clientPlansOptions}
            />
            }
            { clientPlanSelected &&
            <CarriersFilter
              updateComparePlansList={this.updateComparePlansList}
              changeSelectedClientPlanCarrier={this.changeSelectedClientPlanCarrier}
            />
            }
          </div>
          <div className="right-block">
            <AlternativesCounter
              ref={(e) => { this.counter = e; }} // eslint-disable-line react/no-string-refs
              total={allPlansToCompare && allPlansToCompare.length && alternativesCount ? alternativesCount : 0}
              onPrev={this.leftMove}
              onNext={this.rightMove}
            />
          </div>
        </div>
        { (!clientPlansLoading && (!allPlansToCompare || !allPlansToCompare.length)) &&
        <div className="alternatives-container centered">No client plans were found</div>
        }
        { (!clientPlansLoading && clientPlanSelected && allPlansToCompare && allPlansToCompare.length > 0) &&
        <PerfectScrollbar
          option={options}
          ref={(c) => {
            this.scrollBar = c;
          }}
          className="alternatives-scrollbar"
        >
          <div className="compare-inner">
            { !ancillary &&
            <FirstColumn
              section={section}
              planTemplate={(allPlansToCompare && allPlansToCompare[0]) ? allPlansToCompare[0] : {}}
              attributes={attributes}
              accordionActiveIndex={accordionActiveIndex}
              showIntRX={showIntRX}
              externalRX={false}
              planTypeTemplates={planTypeTemplates}
              accordionClick={this.accordionClick}
              optionName
            />
            }
            { ancillary &&
            <FirstLifeColumn
              section={section}
              planTemplate={planTemplate}
              accordionActiveIndex={accordionActiveIndex}
              accordionClick={this.accordionClick}
              // planTemplate={(allPlansToCompare && allPlansToCompare[0]) ? allPlansToCompare[0] : {}}
              // attributes={attributes}
              // accordionActiveIndex={accordionActiveIndex}
              // showIntRX={showIntRX}
              // externalRX={false}
              // planTypeTemplates={planTypeTemplates}
              // accordionClick={this.accordionClick}
              // optionName
            />
            }
            { !ancillary &&
              <div className="alternatives-scrolling">
                <div ref={(c) => { this.mainListInner = c; }} className="alternatives-inner">
                  { allPlansToCompare && allPlansToCompare.map((plan, key) => {
                    const start = mainIndex + count;
                    let from = mainIndex - ((isIE) ? 1 : count + 1);
                    let to = start + ((isIE) ? 0 : count);

                    // if (currentPlanIndex !== null) to -= 1;
                    // if (selectedPlanExists) to -= 1;

                    if (from < 0) from = 0;
                    else if (to > allPlansToCompare.length) to = allPlansToCompare.length;

                    if (key >= from && key <= to) {
                      return (
                        <AlternativesColumn
                          ref={(c) => {
                            this.mainListInner = c;
                          }}
                          key={key}
                          index={key}
                          onAddBenefits={this.onAddBenefits}
                          section={section}
                          carrierName=""
                          motionLink=""
                          multiMode={false}
                          carrier={{carrier: {}}}
                          plan={plan}
                          accordionClick={this.accordionClick}
                          selectNtPlan={this.selectNtPlan}
                          downloadPlanBenefitsSummary={() => {
                          }}
                          attributes={Object.keys(attributes)}
                          accordionActiveIndex={accordionActiveIndex}
                          bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
                          bottomSeparatedRxSysName={bottomSeparatedRxSysName}
                          externalRX={false}
                          thirdColumn
                          repalceButtons
                          onButtonClick={() => {
                          }}
                          showBenefits={showBenefits}
                          showIntRX={showIntRX}
                          setSelectedPlan={() => {
                          }}
                          hideAddAlt
                          hideReplaceMatch
                          optionName={allOptionsToCompare[key].name}
                          planIndex={this.state.currentPlanIndex}
                        />
                      );
                    }

                    if (!isIE) return (<div key={key} className="alternatives-column-dummy" />);

                    return null;
                  })
                  }
                </div>
              </div>
            }
            { ancillary &&
            <div className="alternatives-scrolling">
              <div
                ref={(c) => {
                  this.mainListInner = c;
                }}
                className="alternatives-inner"
              >
                { allPlansToCompare && allPlansToCompare.map((plan, key) => {
                  const start = mainIndex + count;
                  let from = mainIndex - ((isIE) ? 1 : count + 1);
                  let to = start + ((isIE) ? 0 : count);

                  // if (currentPlanIndex !== null) to -= 1;
                  // if (selectedPlanExists) to -= 1;

                  if (from < 0) from = 0;
                  else if (to > allPlansToCompare.length) to = allPlansToCompare.length;

                  if (key >= from && key <= to) {
                    return (
                      <LifeStdLtdColumn
                        section={section}
                        multiMode
                        carrier={{ carrier: {} }}
                        plan={plan}
                        detailedPlan={detailedPlan}
                        accordionActiveIndex={accordionActiveIndex}
                        bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
                        bottomSeparatedRxSysName={bottomSeparatedRxSysName}
                        accordionClick={this.accordionClick}
                        planIndex={this.state.currentPlanIndex}
                      />
                    );
                  }

                  if (!isIE) return (<div key={key} className="alternatives-column-dummy" />);

                  return null;
                })
                }
              </div>
            </div>
            }
          </div>
        </PerfectScrollbar>
        }
        { (clientPlansLoading || !clientPlanSelected) &&
        <div className="alternatives-container centered">
          <Loader inline active={clientPlansLoading} indeterminate size="big">Loading plans</Loader>
        </div>
        }
      </div>
    );
  }
}

export default SectionPage;
