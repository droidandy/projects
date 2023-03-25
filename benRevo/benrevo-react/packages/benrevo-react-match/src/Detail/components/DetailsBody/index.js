import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMode, addNetwork } from '@benrevo/benrevo-react-quote';
import { Grid, Image, Dropdown, Button, Loader, Popup } from 'semantic-ui-react';
import {
  arrowDown,
} from '@benrevo/benrevo-react-core';
import Alternatives from './../Alternatives';
import PlanList from '../PlanList';
import Riders from './../Riders';
import { clearAlternatives } from './../../../actions';

class DetailsBody extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    detailedPlan: PropTypes.object.isRequired,
    networkChange: PropTypes.func.isRequired,
    getAlternatives: PropTypes.func,
    section: PropTypes.string.isRequired,
    alternativesLoading: PropTypes.bool.isRequired,
    clearPlans: PropTypes.func.isRequired,
    networks: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]).isRequired,
    planIndex: PropTypes.number,
    allPlans: PropTypes.array,
    contributions: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]).isRequired,
    kaiserNetworks: PropTypes.array,
    refreshPresentationData: PropTypes.func.isRequired,
  };

  static defaultProps = {
    getAlternatives: null,
    planIndex: null,
    allPlans: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      planList: false,
      currentContribution: null,
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  componentDidMount() {
    const {
      getAlternatives,
      detailedPlan,
      clearPlans,
      section,
    } = this.props;

    clearPlans(section);

    if (getAlternatives && detailedPlan.rfpQuoteOptionNetworkId) {
      getAlternatives();
    }
  }

  toggleModal(type) {
    const modal = !this.state[type];
    this.setState({ [type]: modal });
  }

  isValidSectionPlanType(network, section) {
    if (section.toLowerCase() === 'medical' && ['HMO', 'HSA', 'PPO'].indexOf(network.type) !== -1) {
      return true;
    } else if (section.toLowerCase() === 'dental' && ['DHMO', 'DPPO'].indexOf(network.type) !== -1) {
      return true;
    } else if (section.toLowerCase() === 'vision' && ['VISION'].indexOf(network.type) !== -1) {
      return true;
    }
    return false;
  }

  allPlansContainsCurrent(allPlans) {
    if (!allPlans || (allPlans.length && allPlans.length === 0)) {
      return false;
    }

    let foundCurrent = false;
    for (let i = 0; i < allPlans.length; i += 1) {
      if (allPlans[i].current === 'current') {
        foundCurrent = true;
      }
    }

    return foundCurrent;
  }

  render() {
    const {
      detailedPlan,
      networkChange,
      section,
      alternativesLoading,
      networks,
      planIndex,
      allPlans,
      contributions,
      kaiserNetworks,
      refreshPresentationData,
    } = this.props;
    let options = [];
    // if existed tab - get availableNetworks
    if (detailedPlan && detailedPlan.networks) {
      detailedPlan.networks.forEach((network) => {
        if (network.type === detailedPlan.type) {
          options.push({ key: network.id || network.networkId, text: network.name, value: network.id || network.networkId });
        }
      });
    }
    // if new tab, get all networks
    if ((!detailedPlan || !detailedPlan.networks) && networks && networks.length) {
      networks.forEach((network) => {
        if (network && network.type && this.isValidSectionPlanType(network, section)) {
          options.push({ key: network.id || network.networkId, text: network.name, value: network.id || network.networkId });
        }
      });
    }
    let currentContribution = {};
    if (contributions && contributions.length > 0) {
      contributions.forEach((item) => {
        if (item.rfpQuoteOptionNetworkId === detailedPlan.rfpQuoteOptionNetworkId) {
          currentContribution = item;
        }
      });
    }

    // when it is a new plan or if the plan is a created plan, kaiser networks
    // are part of options
    if (kaiserNetworks && kaiserNetworks.length) {
      kaiserNetworks.forEach((network) => {
        if (network && network.type && this.isValidSectionPlanType(network, section)) {
          options.push({ key: network.id || network.networkId, text: network.name, value: network.id || network.networkId });
        }
      });
      options = Array.from(new Set(options));
    }
    // console.log('detailedBody props', this.props, 'options', options);
    return (
      <Grid className="details-body" key={detailedPlan && detailedPlan.rfpQuoteOptionNetworkId ? detailedPlan.rfpQuoteOptionNetworkId : 'details-body'}>
        <Grid.Row className="header-row">
          <Grid.Column width={4} className="employees-count">
            <span>Employees Enrolled: <strong>{currentContribution.currentEnrollmentTotal || 0}</strong></span>
            <Popup
              inverted
              className="enrollment-popup"
              trigger={<Image className="show-enrollment-popup" src={arrowDown} />}
              position="bottom center"
              hoverable
            >
              <Grid className="enrollment-popup-inner">
                <Grid.Row>
                  <Grid.Column>
                    <header>{detailedPlan.type} Enrollment</header>
                  </Grid.Column>
                </Grid.Row>
                { (currentContribution.contributions && currentContribution.contributions.length > 0) && currentContribution.contributions.map((item, i) =>
                  <Grid.Row key={i}>
                    <Grid.Column width={12}>{item.planName}</Grid.Column>
                    <Grid.Column width={4} className="count">{item.proposedEnrollment}</Grid.Column>
                  </Grid.Row>
                )}
              </Grid>
            </Popup>
          </Grid.Column>
          <Grid.Column width={6} className="choose-network">
            <span className="network">Network: </span>
            <Dropdown
              selectOnBlur={false}
              value={detailedPlan.networkId}
              onChange={(e, inputState) => {
                networkChange(inputState.value, detailedPlan);
              }}
              placeholder="Choose network"
              selection
              options={options}
            />
          </Grid.Column>
          <Grid.Column width={3} floated="right" className="view-plans">
            { (allPlans && (allPlans.length > 2 || (!this.allPlansContainsCurrent(allPlans) && allPlans.length >= 2))) &&
            <Button
              fluid
              primary
              onClick={() => {
                this.toggleModal('planList');
              }}
            >
              View {detailedPlan.type} plans
            </Button>
            }
          </Grid.Column>
          <div className="divider" />
        </Grid.Row>
        { detailedPlan.outOfState &&
        <div className="out-of-state-mark">
          <i className="out-of-state" />
          <span>Out-of-state-plan</span>
        </div>
        }
        { (!alternativesLoading || this.state.planList) &&
        <Grid.Row className="alternatives-container">
          <Alternatives section={section} detailedPlan={detailedPlan} planIndex={planIndex} openModal={this.toggleModal} />
        </Grid.Row>
        }
        { alternativesLoading && !this.state.planList &&
        <Grid.Row className="alternatives-container centered">
          <Loader inline active={alternativesLoading} indeterminate size="big">Loading alternatives</Loader>
        </Grid.Row>
        }
        <Riders section={section} detailedPlan={detailedPlan} />
        <br />
        <PlanList
          planIndex={planIndex}
          section={section}
          detailedPlan={detailedPlan}
          openModal={this.state.planList}
          closeModal={this.toggleModal}
          refreshPresentationData={refreshPresentationData}
        />
      </Grid>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { section, clientId } = ownProps;
  const overviewState = state.get('presentation').get(section);
  const clientsState = state.get('clients');
  const alternatives = overviewState.get('alternativesPlans').toJS();
  return {
    section,
    clientId,
    multiMode: getMode(overviewState.get('page').get('carrier').toJS()),
    client: clientsState.get('current').toJS(),
    networks: overviewState.get('networks').toJS(),
    openedOption: overviewState.get('openedOption').toJS(),
    alternativesLoading: overviewState.get('alternativesLoading'),
    contributions: overviewState.get('openedOptionContributions').toJS(),
    alternativePlans: overviewState.get('alternativePlans').toJS(),
    allPlans: (alternatives && alternatives.plans) ? alternatives.plans : [],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearPlans: (section) => { dispatch(clearAlternatives(section)); },
    addNetworkInMulti: (section, optionId, networkId, clientPlanId) => { dispatch(addNetwork(section, optionId, networkId, clientPlanId)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailsBody);
