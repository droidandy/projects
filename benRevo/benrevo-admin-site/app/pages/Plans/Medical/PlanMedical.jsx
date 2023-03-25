import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Button, Header } from 'semantic-ui-react';
import Helmet from 'react-helmet';
import PlanTable from '../components/PlanTable';

class PlanMedical extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    next: PropTypes.func.isRequired,
    plansTemplates: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    currentBroker: PropTypes.object.isRequired,
    selectedClient: PropTypes.object.isRequired,
    createNewPlan: PropTypes.func.isRequired,
    updatePlanField: PropTypes.func.isRequired,
    planAddedSuccess: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.sectionName = 'Medical';
    this.createPlan = this.createPlan.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { planAddedSuccess } = nextProps;
   // const { next } = nextProps;
    if (planAddedSuccess) {
      // next();
    }
  }

  createPlan() {
    const { createNewPlan } = this.props;
    createNewPlan('medical');
    this.props.next();
  }

  render() {
    const { plansTemplates, loading, currentBroker, selectedClient, updatePlanField } = this.props;
    return (
      <div>
        <Helmet
          title="Medical"
          meta={[
            { name: 'description', content: 'Description of Medical' },
          ]}
        />


        <Grid stackable as={Segment} className="gridSegment">
          <Grid.Row className="header-second">
            <Header as="h1">{currentBroker.name} - {selectedClient.clientName}</Header>
          </Grid.Row>
          <Grid.Row className="header-main">
            <Header as="h2">{this.sectionName}</Header>
            <div className="divider" />
          </Grid.Row>
          <Grid.Row>
            <PlanTable
              plansTemplates={plansTemplates}
              loading={loading}
              section={'medical'}
              updatePlanField={updatePlanField}
            />
          </Grid.Row>
        </Grid>
        <Grid>
          <Grid.Column width={10} only="computer" />
          <Grid.Column tablet={16} computer={6}>
            <Button primary size="big" onClick={this.createPlan}>Save and Continue</Button>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default PlanMedical;
