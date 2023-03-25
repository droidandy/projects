import React from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Grid, Divider, Image, Header } from 'semantic-ui-react';
import { ATTRIBUTES_CONTRACT_LENGTH, AlternativesCounter } from '@benrevo/benrevo-react-quote';
import { favouriteImage } from '@benrevo/benrevo-react-core';
import FirstColumn from '../FirstColumn';
import TotalBlock from './../TotalBlock';
import AlternativesColumn from '../AlternativesColumn';
import CurrentPlanEmpty from './../../Detail/components/CurrentPlanEmpty';
import RxColumn from '../RxColumn';
import { bottomSeparatedBenefitsSysName, bottomSeparatedRxSysName } from '../../constants';
import NewPlanColumn from './../../Detail/components/NewPlanColumn';

class ColumnView extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    planIndex: PropTypes.number,
    section: PropTypes.string.isRequired,
    detailedPlan: PropTypes.object.isRequired,
    smallWidth: PropTypes.bool,
    allPlans: PropTypes.array.isRequired,
    planTemplate: PropTypes.object.isRequired,
    openedOption: PropTypes.object.isRequired,
    currentPlan: PropTypes.object.isRequired,
    // matchPlan: PropTypes.object.isRequired,
    // alternativePlans: PropTypes.array.isRequired,
    planTypeTemplates: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    Filters: PropTypes.func.isRequired,
    allRx: PropTypes.array.isRequired,
    networkName: PropTypes.string,
    setSelectedPlan: PropTypes.func.isRequired,
    setSelectedRxPlan: PropTypes.func.isRequired,
    selectedMainPlan: PropTypes.object,
    selectedRxPlan: PropTypes.object,
    selectNtPlan: PropTypes.func.isRequired,
    addAltPlan: PropTypes.func.isRequired,
    multiMode: PropTypes.bool,
    // showNewPlanColumn: PropTypes.bool,
    alternativesPlans: PropTypes.object.isRequired,
    editAltPlan: PropTypes.func,
    changeAccordionIndex: PropTypes.func,
    currentRx: PropTypes.array,
  };

  static defaultProps = {
    planIndex: null,
    allRx: [],
    networkName: '',
    smallWidth: false,
    selectedMainPlan: null,
    selectedRxPlan: null,
    multiMode: false,
    // showNewPlanColumn: false,
    editAltPlan: () => {},
    changeAccordionIndex: () => {},
  };

  constructor(props) {
    super(props);

    let isIE = false;

    if (navigator.appName === 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/))) {
      isIE = true;
    }

    this.state = {
      alternativesCount: props.allPlans.length,
      alternativesRxCount: props.allRx.length,
      accordionActiveIndex: [false, true, false, false, true],
      count: 0,
      mainIndex: 0,
      rxIndex: 0,
      isIE,
      showNewPlanColumn: false,
      editPlan: null,
      element: null,
    };

    this.updateProps = true;

    this.rightMove = this.rightMove.bind(this);
    this.leftMove = this.leftMove.bind(this);
    this.rightMoveRx = this.rightMoveRx.bind(this);
    this.leftMoveRx = this.leftMoveRx.bind(this);
    this.getCount = this.getCount.bind(this);
    this.accordionClick = this.accordionClick.bind(this);
    this.onAddBenefits = this.onAddBenefits.bind(this);
    this.cancelAddingPlan = this.cancelAddingPlan.bind(this);
    this.openAllAccordions = this.openAllAccordions.bind(this);
    this.toggleNewPlanColumn = this.toggleNewPlanColumn.bind(this);
    this.editPlan = this.editPlan.bind(this);
    this.cancelEditionPlan = this.cancelEditionPlan.bind(this);
    this.savePlan = this.savePlan.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.getCount);
    this.getCount();
    this.props.changeAccordionIndex(this.state.accordionActiveIndex);
  }

  componentWillReceiveProps(nextProps) {
    if (this.updateProps) {
      this.setState({ mainIndex: 0, rxIndex: 0 });
    }
    if (nextProps.allPlans.length !== this.props.allPlans.length) {
      this.setState({ alternativesCount: nextProps.allPlans.length }, () => {
        this.getCount();
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getCount);
  }

  onAddBenefits(/* active */) {
    // this.setState({ addingBenefits: active });
  }

  getAttributes() {
    const plans = this.props.allPlans;
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

  getCount() {
    const { smallWidth } = this.props;
    const small = window.innerWidth < (smallWidth || 1200);
    let count = 0;
    const mainIndex = 0;
    const rxIndex = 0;
    if (this.mainListInner) {
      this.mainListInner.style.transform = 'translate(0px, 0px)';
    }
    if (this.rxListInner) {
      this.rxListInner.style.transform = 'translate(0px, 0px)';
    }
    if (small) {
      count = (!this.state.currentPlanIndex || this.state.currentPlanIndex === null) ? 3 : 2;
    } else {
      count = (!this.state.currentPlanIndex || this.state.currentPlanIndex === null) === null ? 4 : 3;
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
    this.updateProps = false;
  }

  leftMove(e, target, notUpdateCounter) {
    const { isIE } = this.state;
    if (this.state.mainIndex === 0) return;
    let mainIndex = this.state.mainIndex - this.state.count;
    if (mainIndex < 0) mainIndex = 0;

    if (!notUpdateCounter) this.counter.updateCount('prev'); // eslint-disable-line react/no-string-refs

    this.setState({ mainIndex });

    if (!isIE) this.changeSlider(mainIndex);
  }

  rightMove() {
    const { alternativesCount, isIE } = this.state;
    let mainIndex = this.state.mainIndex + this.state.count;
    if (mainIndex >= alternativesCount && alternativesCount - mainIndex <= this.state.count) {
      mainIndex -= this.state.count;
      return;
    } else if (mainIndex > alternativesCount) mainIndex = alternativesCount;

    this.counter.updateCount('next'); // eslint-disable-line react/no-string-refs

    this.setState({ mainIndex });

    if (!isIE) this.changeSlider(mainIndex);
  }

  changeSlider(mainIndex) {
    if (this.mainListInner) {
      this.mainListInner.style.transform = `translate(-${200 * (mainIndex)}px, 0px)`;
    }
  }

  leftMoveRx(e, target, notUpdateCounter) {
    const { isIE } = this.state;

    if (this.state.rxIndex === 0) return;

    let rxIndex = this.state.rxIndex - this.state.count;
    if (rxIndex < 0) rxIndex = 0;

    if (!notUpdateCounter) this.counterRX.updateCount('prev'); // eslint-disable-line react/no-string-refs

    this.setState({ rxIndex });

    if (!isIE) this.changeSliderRX(rxIndex);
  }

  rightMoveRx() {
    const { alternativesRxCount, isIE } = this.state;
    const plansLength = alternativesRxCount;
    let rxIndex = this.state.rxIndex + this.state.count;
    if (rxIndex > plansLength && plansLength - rxIndex < this.state.count) {
      rxIndex -= this.state.count;
      return;
    } else if (rxIndex > plansLength) rxIndex = plansLength;

    this.counterRX.updateCount('next'); // eslint-disable-line react/no-string-refs

    this.setState({ rxIndex });

    if (!isIE) this.changeSliderRX(rxIndex);
  }

  changeSliderRX(rxIndex) {
    if (this.rxListInner) {
      this.rxListInner.style.transform = `translate(-${200 * (rxIndex)}px, 0px)`;
    }
  }

  accordionClick(index) {
    const { changeAccordionIndex } = this.props;
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
    changeAccordionIndex(accordionActiveIndex);
  }

  openAllAccordions() {
    const { changeAccordionIndex } = this.props;
    const { accordionActiveIndex } = this.state;
    for (let i = 0; i < 4; i += 1) {
      accordionActiveIndex[i] = true;
    }
    this.setState({ accordionActiveIndex });
    changeAccordionIndex(accordionActiveIndex);
  }

  toggleNewPlanColumn(value) {
    if (value) {
      this.openAllAccordions();
    }
    this.setState({ showNewPlanColumn: value });
  }

  cancelAddingPlan() {
    this.toggleNewPlanColumn(false);
  }

  editPlan(plan, element) {
    this.openAllAccordions();
    this.setState({ editPlan: plan, element });
  }

  cancelEditionPlan() {
    this.setState({ editPlan: null });
  }

  savePlan(plan) {
    const {
      section,
      detailedPlan,
      editAltPlan,
      multiMode,
      planIndex,
    } = this.props;
    const rfpQuoteNetworkId = detailedPlan.rfpQuoteNetworkId || null;
    editAltPlan(section, plan, rfpQuoteNetworkId, planIndex, multiMode);
  }

  render() {
    const {
      accordionActiveIndex,
      count,
      isIE,
      mainIndex,
      rxIndex,
      alternativesCount,
      alternativesRxCount,
      showNewPlanColumn,
      editPlan,
      element,
    } = this.state;
    const {
      section,
      allPlans,
      planTemplate,
      currentPlan,
      detailedPlan,
      closeModal,
      planTypeTemplates,
      Filters,
      allRx,
      networkName,
      setSelectedPlan,
      setSelectedRxPlan,
      selectedMainPlan,
      selectedRxPlan,
      selectNtPlan,
      addAltPlan,
      multiMode,
      planIndex,
      alternativesPlans,
      openedOption,
      currentRx,
    } = this.props;
    const attributes = this.getAttributes();
    const downloadPlanBenefitsSummary = () => {};
    const options = {
      handlers: ['click-rail', 'drag-thumb', 'keyboard', 'touch'],
      wheelPropagation: false,
    };
    const showBenefits = (planTemplate.benefits && planTemplate.benefits.length > 0);
    const showIntRX = (planTemplate.rx && planTemplate.rx.length > 0);
    const optionName = '';
    const externalRX = (alternativesPlans && alternativesPlans.rx && alternativesPlans.rx.length > 0);
    const kaiserTab = (openedOption && openedOption.quoteType === 'KAISER' && detailedPlan && detailedPlan.kaiserNetwork);
    // console.log('ColumnView allPlans', allPlans, 'allRx', allRx);
    return (
      <div className="alternatives-block">
        <div className="presentation-alternatives-actions">
          <div className="filters left-block">
            { Filters(this.toggleNewPlanColumn) }
          </div>
          <div className="right-block">
            <AlternativesCounter
              ref={(e) => { this.counter = e; }} // eslint-disable-line react/no-string-refs
              total={allPlans.length && alternativesCount ? alternativesCount : 0}
              onPrev={this.leftMove}
              onNext={this.rightMove}
            />
          </div>
        </div>
        { showNewPlanColumn &&
        <NewPlanColumn
          savePlan={this.savePlan}
          networkIndex={planIndex}
          cancelAddingPlan={this.cancelAddingPlan}
          section={section}
          status={'new'}
          currentPlan={currentPlan}
          rfpQuoteNetworkId={detailedPlan.rfpQuoteNetworkId}
          multiMode={multiMode}
          optionName={optionName}
          detailedPlanType={detailedPlan.type}
          detailedPlan={detailedPlan}
          modalView
        />
        }
        { editPlan &&
        <NewPlanColumn
          savePlan={this.savePlan}
          networkIndex={planIndex}
          cancelAddingPlan={this.cancelEditionPlan}
          section={section}
          status={'edit'}
          currentPlan={currentPlan}
          rfpQuoteNetworkId={detailedPlan.rfpQuoteNetworkId}
          multiMode={multiMode}
          optionName={optionName}
          detailedPlanType={detailedPlan.type}
          detailedPlan={detailedPlan}
          modalView
          editPlan={editPlan}
          element={element}
        />
        }
        <PerfectScrollbar option={options} ref={(c) => { this.scrollBar = c; }} className="alternatives-scrollbar">
          <div className="scrollbar-inner">
            <FirstColumn
              section={section}
              planTemplate={planTemplate}
              attributes={attributes}
              accordionActiveIndex={accordionActiveIndex}
              showIntRX={showIntRX}
              externalRX={externalRX}
              planTypeTemplates={planTypeTemplates}
              accordionClick={this.accordionClick}
              editBenefitInfo={multiMode || kaiserTab ? this.editPlan : null}
            />
            { (!Object.keys(currentPlan).length || Object.keys(currentPlan).join(',') === 'benefits,cost') &&
            <CurrentPlanEmpty
              key="currentPlan"
              plan={currentPlan}
              externalRX={externalRX}
              accordionClick={this.accordionClick}
              detailedPlanType={detailedPlan.type}
              detailedPlan={detailedPlan}
              section={section}
              editBenefitInfo={multiMode ? this.editPlan : null}
            />
            }
            { Object.keys(currentPlan).length > 0 && !(Object.keys(currentPlan).join(',') === 'benefits,cost') &&
            <AlternativesColumn
              onAddBenefits={this.onAddBenefits}
              section={section}
              carrierName=""
              motionLink=""
              multiMode={false}
              carrier={{carrier: {}}}
              plan={currentPlan}
              deletePlan={this.deletePlan}
              editPlan={this.editPlan}
              accordionClick={this.accordionClick}
              selectNtPlan={this.selectNtPlan}
              downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
              attributes={Object.keys(attributes)}
              accordionActiveIndex={accordionActiveIndex}
              currentTotal={currentPlan.total}
              bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
              bottomSeparatedRxSysName={bottomSeparatedRxSysName}
              externalRX={externalRX}
              thirdColumn
              repalceButtons
              onButtonClick={closeModal}
              rfpQuoteNetworkId={detailedPlan.rfpQuoteNetworkId}
              rfpQuoteOptionNetworkId={detailedPlan.rfpQuoteOptionNetworkId}
              showBenefits={showBenefits}
              showIntRX={showIntRX}
              showExtRX={((allRx && allRx.length > 0) || currentRx && currentRx.length > 0)}
              showFavourite // this flag is only for modal window mode
              selectedMainPlan={selectedMainPlan}
              setSelectedPlan={setSelectedPlan}
              editBenefitInfo={multiMode || kaiserTab ? this.editPlan : null}
              isCurrentPlan
              planIndex={planIndex}
            />
            }
            <div className="alternatives-scrolling">
              <div ref={(c) => { this.mainListInner = c; }} className="alternatives-inner">
                {allPlans.map((plan, key) => {
                  const start = mainIndex + count;
                  let from = mainIndex - ((isIE) ? 1 : count + 1);
                  let to = start + ((isIE) ? 0 : count);

                  // if (currentPlanIndex !== null) to -= 1;
                  // if (selectedPlanExists) to -= 1;

                  if (from < 0) from = 0;
                  else if (to > allPlans.length) to = allPlans.length;
                  if (key >= from && key <= to) {
                    return (
                      <AlternativesColumn
                        key={key}
                        index={key}
                        onAddBenefits={this.onAddBenefits}
                        section={section}
                        carrierName=""
                        motionLink=""
                        multiMode={false}
                        carrier={{ carrier: {} }}
                        plan={plan}
                        deletePlan={this.deletePlan}
                        editPlan={this.editPlan}
                        accordionClick={this.accordionClick}
                        selectNtPlan={this.selectNtPlan}
                        downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
                        attributes={Object.keys(attributes)}
                        accordionActiveIndex={accordionActiveIndex}
                        currentTotal={currentPlan.total}
                        bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
                        bottomSeparatedRxSysName={bottomSeparatedRxSysName}
                        externalRX={externalRX}
                        thirdColumn
                        repalceButtons
                        onButtonClick={closeModal}
                        rfpQuoteNetworkId={detailedPlan.rfpQuoteNetworkId}
                        rfpQuoteOptionNetworkId={detailedPlan.rfpQuoteOptionNetworkId}
                        showBenefits={showBenefits}
                        showIntRX={showIntRX}
                        showExtRX={((allRx && allRx.length > 0) || currentRx && currentRx.length > 0)}
                        showFavourite // this flag is only for modal window mode
                        selectedMainPlan={selectedMainPlan}
                        setSelectedPlan={setSelectedPlan}
                        editBenefitInfo={multiMode || kaiserTab ? this.editPlan : null}
                        planIndex={planIndex}
                      />
                    );
                  }
                  if (!isIE) return (<div key={key} className="alternatives-column-dummy" />);
                  return null;
                })
                }
              </div>
            </div>
          </div>
        </PerfectScrollbar>
        { ((allRx && allRx.length > 0) || (currentRx && currentRx.length > 0)) &&
        <Grid className="rx-block">
          <Grid.Row>
            <Grid.Column width={16}>
              <Divider horizontal>Just looking? Mark (<Image src={favouriteImage} alt="favourite" />) your favourites to
                access anytime</Divider>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="rx-header-row">
            <Grid.Column width={8}>
              <Header className="presentation-options-header" as="h2">RX Plans</Header>
              <div className="presentation-sub-header">{networkName}</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        }
        { (allRx && allRx.length > 0) &&
        <div className="presentation-alternatives-actions rx-actions">
          <div className="right-block">
            <AlternativesCounter
              ref={(e) => { this.counterRX = e; }} // eslint-disable-line react/no-string-refs
              total={allRx.length && alternativesRxCount ? alternativesRxCount : 0}
              onPrev={this.leftMoveRx}
              onNext={this.rightMoveRx}
            />
          </div>
        </div>
        }
        { (allRx && (allRx.length > 0 || (currentRx && currentRx.length > 0))) &&
        <PerfectScrollbar option={options} ref={(c) => { this.scrollBarRx = c; }} className="alternatives-scrollbar">
          <div className="scrollbar-inner">
            <FirstColumn
              planTemplate={planTemplate}
              attributes={attributes}
              accordionActiveIndex={accordionActiveIndex}
              showIntRX={showIntRX}
              showExtRX={((allRx && allRx.length > 0) || (currentRx && currentRx.length))}
              planTypeTemplates={planTypeTemplates}
              accordionClick={this.accordionClick}
              rxPlanTemplate={currentRx[0]}
            />
            <RxColumn
              onAddBenefits={this.onAddBenefits}
              section={section}
              carrierName=""
              motionLink=""
              multiMode={false}
              carrier={{ carrier: {} }}
              plan={currentRx[0]}
              deletePlan={this.deletePlan}
              editPlan={this.editPlan}
              accordionClick={this.accordionClick}
              selectNtPlan={this.selectNtPlan}
              downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
              attributes={Object.keys(attributes)}
              accordionActiveIndex={accordionActiveIndex}
              currentTotal={currentPlan.total}
              bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
              bottomSeparatedRxSysName={bottomSeparatedRxSysName}
              externalRX={false}
              thirdColumn
              repalceButtons
              onButtonClick={closeModal}
              rfpQuoteNetworkId={detailedPlan.rfpQuoteNetworkId}
              rfpQuoteOptionNetworkId={detailedPlan.rfpQuoteOptionNetworkId}
              showBenefits={showBenefits}
              showIntRX={showIntRX}
              showFavourite
              selectedRxPlan={selectedRxPlan}
              setSelectedRxPlan={setSelectedRxPlan}
              detailedPlanType={detailedPlan.type}
            />
            <div className="alternatives-scrolling">
              <div ref={(c) => { this.rxListInner = c; }} className="alternatives-inner">
                {allRx.map((plan, key) => {
                  // if (currentRxPlan && plan.name === currentRxPlan.name) {
                  //   return;
                  // }
                  const start = rxIndex + count;
                  let from = rxIndex - ((isIE) ? 1 : count + 1);
                  let to = start + ((isIE) ? 0 : count);
                  if (from < 0) from = 0;
                  else if (to > allRx.length) to = allRx.length;

                  if (key >= from && key <= to) {
                    return (
                      <RxColumn
                        key={key}
                        index={key}
                        onAddBenefits={this.onAddBenefits}
                        section={section}
                        carrierName=""
                        motionLink=""
                        multiMode={false}
                        carrier={{carrier: {}}}
                        plan={plan}
                        deletePlan={this.deletePlan}
                        editPlan={this.editPlan}
                        accordionClick={this.accordionClick}
                        selectNtPlan={this.selectNtPlan}
                        downloadPlanBenefitsSummary={downloadPlanBenefitsSummary}
                        attributes={Object.keys(attributes)}
                        accordionActiveIndex={accordionActiveIndex}
                        currentTotal={currentPlan.total}
                        bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
                        bottomSeparatedRxSysName={bottomSeparatedRxSysName}
                        externalRX={false}
                        thirdColumn
                        repalceButtons
                        onButtonClick={closeModal}
                        rfpQuoteNetworkId={detailedPlan.rfpQuoteNetworkId}
                        rfpQuoteOptionNetworkId={detailedPlan.rfpQuoteOptionNetworkId}
                        showBenefits={showBenefits}
                        showIntRX={showIntRX}
                        showFavourite
                        selectedRxPlan={selectedRxPlan}
                        setSelectedRxPlan={setSelectedRxPlan}
                      />
                    );
                  }

                  if (!isIE) return (<div key={key} className="alternatives-column-dummy" />);

                  return null;
                })
                }
              </div>
            </div>
          </div>
        </PerfectScrollbar>
        }
        { ((allRx && allRx.length > 0) || (currentRx && currentRx.length > 0)) &&
        <TotalBlock
          addAltPlan={addAltPlan}
          selectNtPlan={selectNtPlan}
          section={section}
          selectedMainPlan={selectedMainPlan}
          selectedRxPlan={selectedRxPlan}
          currentPlan={currentPlan}
          closeModal={closeModal}
        />
        }
      </div>
    );
  }
}

export default ColumnView;
