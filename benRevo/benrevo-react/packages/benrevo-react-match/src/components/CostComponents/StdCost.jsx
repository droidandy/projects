import React from 'react';
import { Grid } from 'semantic-ui-react';
import stdCostList from './stdCostList';
import volStdCostList from './volStdCostList';

const StdCost = (props) => (
  <Grid className="cost-row-body life-add">
    <Grid.Column className={`alt-table-column first first-column ${props.section} ${props.section === 'std' ? 'std' : 'vol-std'}`}>
      { props.section === 'std' && stdCostList.map((item) =>
        <Grid columns={1} className={`${(item.name && item.name !== 'Monthly Cost') ? 'name value-row' : 'empty value-row'}`}>
          <Grid.Row>{item.name !== 'Monthly Cost' ? item.name : null}</Grid.Row>
        </Grid>
      )}
      { props.section === 'vol_std' && volStdCostList.map((item) =>
        <Grid columns={1} className={`${(item.name && item.name !== 'Monthly Cost') ? 'name value-row' : 'empty value-row'}`}>
          <Grid.Row>{item.name !== 'Monthly Cost' ? item.name : null}</Grid.Row>
        </Grid>
      )}
    </Grid.Column>
  </Grid>
  );
export default StdCost;

