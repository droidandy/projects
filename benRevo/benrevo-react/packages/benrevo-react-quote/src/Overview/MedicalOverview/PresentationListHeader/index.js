/**
*
* ClientListHeader
*
*/

import React from 'react';
import { Grid } from 'semantic-ui-react';
import styled from 'styled-components';


function PresentationListHeader() {
  const Component = styled.div`
    text-align: left;
    padding-bottom: 5px;
    margin-bottom: 15px;
    border-bottom: #aaaaaa solid 1px;
    font-size: 12px;
    padding-left: 40px;
    padding-right: 40px;
  `;

  return (
    <Component>
      <Grid>
        <Grid.Row>
          <Grid.Column width={7}>Carrier</Grid.Column>
          <Grid.Column width={3}>Employer</Grid.Column>
          <Grid.Column width={3}>Employee</Grid.Column>
          <Grid.Column width={3}>Monthly Total</Grid.Column>
        </Grid.Row>
      </Grid>
    </Component>
  );
}

export default PresentationListHeader;
