/**
*
* ClientListHeader
*
*/

import React from 'react';
import { Grid } from 'semantic-ui-react';
import { DividedRow, HeaderColumn } from '../../../presentationComponents';

function PlanListHeader() {
  return (
    <Grid>
      <DividedRow>
        <HeaderColumn width={5}>Plan Name</HeaderColumn>
        <HeaderColumn width={2}>Type</HeaderColumn>
        <HeaderColumn width={3}>Employer</HeaderColumn>
        <HeaderColumn width={3}>Employee</HeaderColumn>
        <HeaderColumn width={3}>Monthly Total</HeaderColumn>
      </DividedRow>
    </Grid>
  );
}

export default PlanListHeader;
