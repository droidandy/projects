import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Image, Menu, Icon } from 'semantic-ui-react';
import {
  addNewPlanImg,
  closeIcon,
} from '@benrevo/benrevo-react-core';
import DetailsHeader from './components/DetailsHeader';
import DetailsBody from './components/DetailsBody';
import DetailesLifeBody from './components/DetailesLifeBody';
import ClearValueModal from './components/ClearValueModal';
import StandardModal from './components/StandardModal';
import AllPlansTab from './components/AllPlansTab';
import { KAISER_TEXT } from '../constants';

class DetailsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    clientId: PropTypes.string.isRequired,
    refreshPresentationData: PropTypes.func.isRequired,
    openedOptionClear: PropTypes.func.isRequired,
    openedOption: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired,
    multiMode: PropTypes.bool.isRequired,
    addNetwork: PropTypes.func.isRequired,
    deleteNetwork: PropTypes.func.isRequired,
    changeOptionNetwork: PropTypes.func.isRequired,
    getAllPlans: PropTypes.func.isRequired,
    clearPlans: PropTypes.func.isRequired,
    violationStatus: PropTypes.bool,
    getPlansTemplates: PropTypes.func.isRequired,
    addOptionForNewProducts: PropTypes.func.isRequired,
    getAnotherOptions: PropTypes.func.isRequired,
  };

  static defaultProps = {
    violationStatus: false,
  };

  constructor(props) {
    super(props);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.setTabsCount = this.setTabsCount.bind(this);
    this.networkChange = this.networkChange.bind(this);
    this.removeNetwork = this.removeNetwork.bind(this);
    this.pushLeft = this.pushLeft.bind(this);
    this.pushRight = this.pushRight.bind(this);
    this.addNewDetailPlan = this.addNewDetailPlan.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.getAlternatives = this.getAlternatives.bind(this);
    this.closeAddPlanModal = this.closeAddPlanModal.bind(this);
    this.refreshPresentationData = this.refreshPresentationData.bind(this);

    this.state = {
      activeIndex: 1,
      tabsCount: 0,
      newTab: false,
      // for Anthem + Standard - standatdModal
      // for Anthem + Clear Value - clearValueModal
      standardModalOpen: false,
      clearValueModalOpen: false,
    };
    this.updateProps = true;
    this.allPlanTab = null;
  }

  componentWillMount() {
    this.refreshPresentationData();
  }

  componentWillReceiveProps() {
    this.setTabsCount();
  }

  getAlternatives() {
    const {
      section,
      multiMode,
      getAllPlans,
    } = this.props;
    // this is openedOption - detailedPlan index
    const { activeIndex } = this.state;
    getAllPlans(section, (activeIndex - 1), multiMode, true);
    this.setState({ newTab: false });
  }

  setTabsCount() {
    // set the number of tabs shown
    this.setState({ tabsCount: 6 }); // for full width this const is 6
  }

  refreshPresentationData() {
    const {
      openedOption,
      clearPlans,
      section,
      page,
      getPlansTemplates,
    } = this.props;
    const openedId = openedOption.id;
    const selectedId = page.id;
    const id = selectedId || openedId;
    clearPlans(section);
    this.props.openedOptionClear(section);
    if (section !== 'medical' && section !== 'dental' && section !== 'vision') {
      const option = {
        carrier: page.carrier,
        id,
        optionType: page.optionType,
      };
      this.props.addOptionForNewProducts(option, section);
      this.props.getAnotherOptions(section);
    } else {
      this.props.refreshPresentationData(section, page.carrier, id, true, page.kaiser, page.optionType, null);
    }
    // load benefits templates for empty plans
    getPlansTemplates(section);
  }

  // change or add detailedPlan network
  networkChange(networkId, detailedPlan) {
    const {
      multiMode,
      changeOptionNetwork,
      addNetwork,
      section,
      openedOption,
    } = this.props;
    // existed tab = change network, new tab = add network
    if (multiMode) {
      if (detailedPlan && Object.keys(detailedPlan).length > 0 && detailedPlan.rfpQuoteOptionNetworkId) {
        changeOptionNetwork(section, openedOption.id, networkId, detailedPlan.rfpQuoteOptionNetworkId, multiMode);
      } else {
        // task https://app.asana.com/0/668668568580308/690684106470770
        addNetwork(section, openedOption.id, networkId, (detailedPlan.currentPlan) ? detailedPlan.currentPlan.planId : null, multiMode);
      }
    }
    if (!multiMode) {
      if (detailedPlan && Object.keys(detailedPlan).length > 0 && detailedPlan.rfpQuoteOptionNetworkId) {
        changeOptionNetwork(section, openedOption.id, networkId, detailedPlan.rfpQuoteOptionNetworkId, multiMode, true);
      } else {
        addNetwork(section, openedOption.id, networkId, (detailedPlan.currentPlan) ? detailedPlan.currentPlan.planId : null, multiMode);
      }
    }
  }

  removeNetwork(detailedPlan) {
    let { activeIndex } = this.state;
    const {
      deleteNetwork,
      section,
      openedOption,
    } = this.props;
    const { detailedPlans } = openedOption;
    deleteNetwork(section, openedOption.id, detailedPlan.rfpQuoteOptionNetworkId);
    if (activeIndex && activeIndex === detailedPlans.length) {
      activeIndex -= 1;
    }
    this.setState({ activeIndex });
  }

  pushLeft() {
    let { activeIndex } = this.state;
    if (activeIndex) {
      activeIndex -= 1;
    }
    this.setState({ activeIndex });
  }

  pushRight() {
    const { openedOption } = this.props;
    const { newTab } = this.state;
    const detailedPlans = openedOption ? openedOption.detailedPlans : [];
    let { activeIndex } = this.state;
    if ((activeIndex < detailedPlans.length) || (activeIndex === detailedPlans.length && newTab)) {
      activeIndex += 1;
      this.setState({ activeIndex });
    }
  }

  addNewDetailPlan() {
    const { page, openedOption } = this.props;
    const { newTab } = this.state;
    if (newTab) {
      return false;
    }
    // instead of quoteType I am using carrier.name here
    let { clearValueModalOpen } = this.state;
    const { standardModalOpen } = this.state;
    if (page && page.carrier && page.carrier.carrier && page.carrier.carrier.name === 'ANTHEM_CLEAR_VALUE') {
      clearValueModalOpen = true;
    }
    this.setState({ newTab: true, standardModalOpen, clearValueModalOpen }, () => {
      this.setTabsCount();
    });
    const detailedPlans = (openedOption && openedOption.detailedPlans && openedOption.detailedPlans.length) ? openedOption.detailedPlans : [];
    if (detailedPlans.length > 0) {
      this.setState({ activeIndex: detailedPlans.length + 1 });
    }
    return true;
  }

  handleTabChange(e, data) {
    if (e.target.name === 'remove-button') return false;
    const { openedOption, clearPlans } = this.props;
    const { newTab } = this.state;
    const { detailedPlans } = openedOption;
    // clear the new tab if we did't set network
    if (newTab && data.activeIndex <= (detailedPlans.length)) {
      this.setState({ newTab: false });
    }
    // clear alternatives when there are no detailedPlan.rfpQuoteOptionNetworkId
    if (!detailedPlans[data.activeIndex] || !detailedPlans[data.activeIndex].rfpQuoteOptionNetworkId) {
      clearPlans();
    }
    this.setState({ activeIndex: data.activeIndex });
    this.setTabsCount();
    return true;
  }

  closeAddPlanModal(networkId, detailedPlan) {
    if (networkId && detailedPlan) {
      this.networkChange(networkId, detailedPlan);
    }
    this.setState({ standardModalOpen: false, clearValueModalOpen: false });
  }

  render() {
    const {
      clientId,
      page,
      openedOption,
      violationStatus,
      section,
    } = this.props;
    const life = !(section === 'medical' || section === 'dental' || section === 'vision');
    const {
      activeIndex,
      newTab,
      standardModalOpen,
      clearValueModalOpen,
      tabsCount,
    } = this.state;
    const detailedPlans = (openedOption && openedOption.detailedPlans && openedOption.detailedPlans.length) ? openedOption.detailedPlans : [];
    const styleOffset = (detailedPlans && ((detailedPlans.length >= tabsCount) || (detailedPlans.length === tabsCount - 1 && newTab))) ? 68 : 0; // overflow flag
    const styleIterator = styleOffset - (activeIndex >= tabsCount ? (86 + (129 * (activeIndex - tabsCount))) : 0); // style for tabs
    const tabStyle = {
      transform: `translateX(${styleIterator}px)`,
    };
    // const allPlansTabClass = `${violationStatus ? 'warning' : ''} ${detailedPlans && detailedPlans.length >= 6 ? 'scrolled' : ''}`;
    const emptyDetailedPlan = {};
    const addNewPlanTab = <Menu.Item key="addNewTab" style={tabStyle} className="last-tab" onClick={() => this.addNewDetailPlan()}><div className="add-new-tab"><Image src={addNewPlanImg} /><span>add new plan</span></div></Menu.Item>;
    const emptyPlanTab = <Menu.Item key="emptyPlanTab" style={tabStyle}>-</Menu.Item>;
    const allPlansTab = <Menu.Item ref={(allPlanTab) => { this.allPlanTab = allPlanTab; }} style={tabStyle} className={violationStatus ? 'warning' : ''} key="allPlanTab"><div className="warning-icon"></div>ALL</Menu.Item>;
    const kaiserPlans = detailedPlans.filter((item) => item && item.networks && item.networks.length && item.networks[0].name.indexOf(KAISER_TEXT) !== -1);
    let kaiserNetworks = [];
    if (kaiserPlans && kaiserPlans.length) kaiserNetworks = kaiserPlans[0].networks;
    let panes = [];
    if (!life) {
      if (detailedPlans && detailedPlans.length > 0 && detailedPlans[0]) {
        // this is for indexing plans with same types
        const planTypesCounts = {};
        const planTypesIndexes = [];
        const planTypeShowIndexes = {};
        detailedPlans.forEach((plan, index) => {
          planTypesCounts[plan.type] = planTypesCounts[plan.type] ? planTypesCounts[plan.type] + 1 : 1;
          planTypesIndexes[index] = planTypesCounts[plan.type];
          planTypeShowIndexes[plan.type] = planTypesCounts[plan.type] > 1;
        });
        panes = detailedPlans.map((item, index) => ({
          menuItem:
            <Menu.Item
              style={tabStyle}
              key={`${item ? item.rfpQuoteNetworkId : 'key'} ${index}`}
            >{item ? `${item.type} ${planTypeShowIndexes[item.type] ? planTypesIndexes[index] : ''}` : ''}
              { (item && !item.currentPlan && item.rfpQuoteOptionNetworkId) &&
              <span role="button" onClick={() => this.removeNetwork(item)} className="close"><Image name="remove-button" src={closeIcon} /></span>
              }
            </Menu.Item>,
          render: () =>
            <DetailsBody
              refreshPresentationData={this.refreshPresentationData}
              key={item ? item.rfpQuoteNetworkId + index + item.type : 'empty'}
              getAlternatives={(item && item.rfpQuoteNetworkId && item.rfpQuoteOptionNetworkId) ? this.getAlternatives : null}
              networkChange={this.networkChange}
              detailedPlan={item}
              section={section}
              clientId={clientId}
              planIndex={activeIndex ? activeIndex - 1 : 0}
              kaiserNetworks={(item && !item.currentPlan && item.rfpQuoteOptionNetworkId) ? kaiserNetworks : []}
            />,
        }));
      }
      // all plans tab
      panes.unshift({
        menuItem: allPlansTab,
        render: () =>
          <AllPlansTab section={section} />,
      });
      // empty tab
      if (!detailedPlans.length || newTab) {
        panes.push({
          menuItem: emptyPlanTab,
          render: () =>
            <DetailsBody
              key={-1}
              refreshPresentationData={this.refreshPresentationData}
              networkChange={this.networkChange}
              detailedPlan={emptyDetailedPlan}
              section={section}
              clientId={clientId}
              planIndex={activeIndex}
              kaiserNetworks={kaiserNetworks}
            />,
        });
      }
      // tab for "add new plan"
      if (detailedPlans && detailedPlans.length < tabsCount) {
        panes.push({ menuItem: addNewPlanTab, render: () => <div></div> });
      }
    } else {
      panes.push({
        menuItem: <Menu.Item key="emptyPlanTab">{section.toUpperCase()}</Menu.Item>,
        render: () =>
          <DetailesLifeBody
            networkChange={this.networkChange}
            section={section}
            clientId={clientId}
          />,
      });
    }
    return (
      <div id="details-page" className="details-page">
        <DetailsHeader ancillary={life} section={section} clientId={clientId} carrier={(page && page.carrier && page.carrier.carrier) ? page.carrier.carrier : {}} />
        { detailedPlans && (detailedPlans.length >= tabsCount || (detailedPlans.length === tabsCount - 1 && newTab)) &&
        <div className="tab-switcher left">
          <div className="btn-block">
            <button className="left" onClick={() => this.pushLeft()}><Icon name="chevron left" /></button>
            <button className="right" onClick={() => this.pushRight()}><Icon name="chevron right" /></button>
          </div>
        </div>
        }
        { detailedPlans && (detailedPlans.length >= tabsCount || (detailedPlans.length === tabsCount - 1 && newTab)) &&
        <div className="tab-switcher right">
          <button className="add" onClick={() => this.addNewDetailPlan()}>
            <Image src={addNewPlanImg} />
          </button>
        </div>
        }
        { !life &&
        <Tab activeIndex={activeIndex} className="tab-menu" onTabChange={this.handleTabChange} panes={panes} />
        }
        { life &&
        <Tab activeIndex={0} className="tab-menu" onTabChange={this.handleTabChange} panes={panes} />
        }
        <ClearValueModal
          section={section}
          clearValueModalOpen={clearValueModalOpen}
          closeAddPlanModal={this.closeAddPlanModal}
          detailedPlan={emptyDetailedPlan}
        />
        <StandardModal section={section} standardModalOpen={standardModalOpen} closeAddPlanModal={this.closeAddPlanModal} />
      </div>
    );
  }
}

export default DetailsPage;
