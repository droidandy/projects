import React from 'react';
import { Grid } from 'semantic-ui-react';
import ltdBenefitsList from './ltdBenefitsList';
import volLtdBenefitsList from './volLtdBenefitsList';

const LtdBenefits = (props) => (
  <Grid className="benefits-row-body life-add">
    <Grid.Column className="alt-table-column first first-column">
      <Grid columns={1} className="value-row firstCol">
        <Grid.Row className="center-aligned empty-row life" />
      </Grid>
      { props.section === 'ltd' && ltdBenefitsList.map((item) =>
        <Grid columns={1} className="bottom-separated">
          <Grid.Row>
            <Grid.Column className="one-col benefits row-name content-col white">
              {item.name}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
      { props.section === 'vol_ltd' && volLtdBenefitsList.map((item) =>
        <Grid columns={1} className="bottom-separated">
          <Grid.Row>
            <Grid.Column className="one-col benefits row-name content-col white">
              {item.name}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
    </Grid.Column>
  </Grid>
  );
export default LtdBenefits;

