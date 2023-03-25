/**
*
* ClientListHeader
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';

function PlanListHeader({ hsa }) {
  return (
    <div className="card-contributions-component">
      <Grid textAlign="left" columns="equal">
        <Grid.Row className="card-contributions-row" verticalAlign="middle">
          <Grid.Column width={3}>Coverage Tier</Grid.Column>
          <Grid.Column width={(hsa) ? 2 : 3}>Current ER</Grid.Column>
          {hsa && <Grid.Column width={2}>
            HSA <br /> Employer Fund <br />(Annual)
            </Grid.Column> }
          <Grid.Column width={2}>Proposed ER</Grid.Column>
          <Grid.Column>Proposed EE</Grid.Column>
          <Grid.Column>Difference EE</Grid.Column>
          <Grid.Column width={2}>Current Enrollment</Grid.Column>
          <Grid.Column width={2}>Proposed Enrollment</Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

PlanListHeader.propTypes = {
  hsa: PropTypes.bool.isRequired,
};

export default PlanListHeader;
