import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMode, addNetwork } from '@benrevo/benrevo-react-quote';
import { Grid, Button } from 'semantic-ui-react';
import AlternativesLife from './../AlternativesLife';
import { clearAlternatives } from './../../../actions';

class DetailesLifeBody extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    detailedPlan: PropTypes.object,
    hasAlternative: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    getAlternatives: null,
    planIndex: null,
    allPlans: [],
    detailedPlan: null,
  };

  constructor(props) {
    super(props);
    this.openModal = this.openModal.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      planList: false,
      currentContribution: null,
    };
  }

  openModal(type) {
    const modal = !this.state[type];
    this.setState({ [type]: modal });
  }

  toggleModal(type) {
    const modal = !this.state[type];
    this.setState({ [type]: modal });
  }

  render() {
    const {
      section,
      detailedPlan,
      hasAlternative,
    } = this.props;
    // console.log('detailedLifeBody props', this.props);
    return (
      <Grid className="details-body life" key={section}>
        <Grid.Row className="header-row">
          <Grid.Column width={3} floated="right" className="view-plans">
            {hasAlternative && <Button
              className="view-life-plans-modal"
              fluid
              primary
              floated="right"
              onClick={() => {
                this.toggleModal('planList');
              }}
            >
                View {section.toUpperCase()} plans
              </Button>
            }
          </Grid.Column>
          {hasAlternative && <div className="divider" /> }
        </Grid.Row>
        <Grid.Row className="alternatives-container">
          { (detailedPlan && Object.keys(detailedPlan).length > 0) &&
          <AlternativesLife section={section} detailedPlan={detailedPlan} planList={this.state.planList} toggleModal={this.toggleModal} />
          }
        </Grid.Row>
      </Grid>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { section, clientId } = ownProps;
  const overviewState = state.get('presentation').get(section);
  const clientsState = state.get('clients');
  const openedOption = overviewState.get('openedOption').toJS();
  const detailedPlan = openedOption.detailedPlan;
  const plans = detailedPlan && detailedPlan.plans ? detailedPlan.plans : [];
  let hasAlternative = false;
  if (plans.length) {
    plans.forEach((plan) => {
      if (plan.type === 'alternative' && !plan.selected && !plan.selectedSecond) {
        hasAlternative = plan;
      }
    });
  }
  return {
    detailedPlan,
    section,
    clientId,
    hasAlternative,
    multiMode: getMode(overviewState.get('page').get('carrier').toJS()),
    client: clientsState.get('current').toJS(),
    openedOption: overviewState.get('openedOption').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearPlans: (section) => { dispatch(clearAlternatives(section)); },
    addNetworkInMulti: (section, optionId, networkId, clientPlanId) => { dispatch(addNetwork(section, optionId, networkId, clientPlanId)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailesLifeBody);
