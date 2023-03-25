import React from 'react';
import { Grid } from 'semantic-ui-react';
import ltdCostList from './ltdCostList';
import volLtdCostList from './volLtdCostList';

const LtdCost = (props) => (
  <Grid className="cost-row-body life-add">
    <Grid.Column className={`alt-table-column first first-column ${props.section} ${props.section === 'ltd' ? 'ltd' : 'vol-ltd'}`}>
      { props.section === 'ltd' && ltdCostList.map((item) =>
        <Grid columns={1} className={`${(item.name && item.name !== 'Monthly Cost') ? 'name value-row' : 'empty value-row'}`}>
          <Grid.Row>{item.name !== 'Monthly Cost' ? item.name : null}</Grid.Row>
        </Grid>
      )}
      { props.section === 'vol_ltd' && volLtdCostList.map((item) =>
        <Grid columns={1} className={`${(item.name && item.name !== 'Monthly Cost') ? 'name value-row' : 'empty value-row'}`}>
          <Grid.Row>{item.name !== 'Monthly Cost' ? item.name : null}</Grid.Row>
        </Grid>
      )}
    </Grid.Column>
  </Grid>
  );
export default LtdCost;

