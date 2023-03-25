import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';

class BenefitsHead extends React.Component {
  static propTypes = {
    planTemplate: PropTypes.object.isRequired,
  };

  render() {
    const { planTemplate } = this.props;
    if (!Object.keys(planTemplate).length) {
      return (
        <div></div>
      );
    }
    if (planTemplate && planTemplate.benefits && planTemplate.benefits[0] && 'valueIn' in planTemplate.benefits[0]) {
      return (
        <Grid
          columns={2}
          className={`alt-table-column first-plan white ${planTemplate.selected ? 'selected' : ''} ${planTemplate.type}`}
          id="benefits-editing-anchor"
        >
          <Grid.Row className="center-aligned benefits-row separated">
            <Grid.Column>
              IN-NETWORK
            </Grid.Column>
            <Grid.Column>
              OUT-NETWORK
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
    return (
      <Grid
        columns={1}
        className={`alt-table-column first-plan white ${planTemplate.selected ? 'selected' : ''} ${planTemplate.type}`}
        id="benefits-editing-anchor"
      >
        <Grid.Row className="center-aligned benefits-row">
          <Grid.Column>
            IN-NETWORK
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
export default BenefitsHead;
