import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Loader, Segment, Button, Header, Dimmer } from 'semantic-ui-react';
import ContributionTable from './components/ContributionTable';


class PresentationData extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    selectedClient: PropTypes.object.isRequired,
    getClientPlans: PropTypes.func.isRequired,
    clientPlans: PropTypes.array.isRequired,
    changedPlans: PropTypes.array.isRequired,
    updateSelectedPlan: PropTypes.func.isRequired,
    resetPlanChanges: PropTypes.func.isRequired,
    selectedTiers: PropTypes.array.isRequired,
    loadingContributions: PropTypes.bool.isRequired,
    currentBroker: PropTypes.object.isRequired,
    saveContribution: PropTypes.func.isRequired,
    savingContributions: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      statusModalOpen: false,
      moveModalOpen: false,
      stateOfInterest: '',
    };
  }

  componentWillMount() {
    const { getClientPlans, selectedClient } = this.props;
    getClientPlans(selectedClient.id);
  }

  render() {
    const { loadingContributions, selectedTiers, clientPlans, changedPlans, updateSelectedPlan, resetPlanChanges,
            currentBroker, selectedClient, saveContribution, savingContributions } = this.props;
    let disabled = true;
    for (let i = 0; i < clientPlans.length; i += 1) {
      for (let j = 0; j < selectedTiers[i].length; j += 1) {
        const tier = selectedTiers[i][j];
        if (tier && changedPlans.length &&
           ((tier.census !== null || (changedPlans[i] && changedPlans[i][`tier${j}_census`])) &&
           (tier.contribution !== null || (changedPlans[i] && changedPlans[i][`tier${j}_er_contribution`])) &&
           (tier.rate !== null || (changedPlans[i] && changedPlans[i][`tier${j}_rate`])) &&
           (tier.renewal !== null || (changedPlans[i] && changedPlans[i][`tier${j}_renewal`])) &&
           (clientPlans[i].er_contribution_format !== null || (changedPlans[i] && changedPlans[i].er_contribution_format)) &&
           (clientPlans[i].out_of_state !== null || (changedPlans[i] && changedPlans[i].out_of_state)) &&
           (clientPlans[i].planName !== null || (changedPlans[i] && changedPlans[i].planName)))) {
          disabled = false;
        } else if (tier) {
          disabled = true;
          break;
        }
      }
    }
    return (
      <div className="plans-files plan-data">
        <Grid stackable as={Segment} className="gridSegment">
          <Grid.Row className="header-second">
            <Header as="h1">{currentBroker.name} - {selectedClient.clientName}</Header>
          </Grid.Row>
          <Grid.Row className="header-main">
            <Header as="h2">Contribution Data</Header>
            <div className="divider" />
          </Grid.Row>
          <Dimmer active={savingContributions} inverted>
            <Loader indeterminate size="big">Saving Changes</Loader>
          </Dimmer>
          { (loadingContributions || clientPlans.length > 0) &&
            <Grid.Row className="table-row">
              <Grid.Column width={5}>
                <Header as="h3" className="page-section-heading">Plan Data</Header>
              </Grid.Column>
              <Loader active={loadingContributions}>Getting contribution data</Loader>
              { !loadingContributions && clientPlans.length > 0 && clientPlans.map((plan, index) => (
                <ContributionTable
                  key={plan.client_plan_id}
                  plan={plan}
                  changedPlans={changedPlans}
                  index={index}
                  updateSelectedPlan={updateSelectedPlan}
                  resetPlanChanges={resetPlanChanges}
                  selectedTiers={selectedTiers}
                />
              ))}
            </Grid.Row>
          }
        </Grid>

        <Grid>
          <Grid.Row>
            <Grid.Column width={10} only="computer">
            </Grid.Column>
            <Grid.Column tablet={16} computer={6}>
              <Button disabled={disabled} primary size="big" onClick={() => saveContribution()}>{ savingContributions ? 'Saving..' : 'Save' } </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default PresentationData;
