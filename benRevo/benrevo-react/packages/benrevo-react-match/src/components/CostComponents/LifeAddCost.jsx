import React from 'react';
import { Grid } from 'semantic-ui-react';
import lifeCostList from './lifeCostList';
import volLifeCostList from './volLifeCostList';

const LifeADDCost = (props) => (
  <Grid className="cost-row-body life-add">
    <Grid.Column className={`alt-table-column first first-column ${props.section} ${props.section === 'life' ? 'life' : 'vol-life'}`}>
      { props.section === 'life' && lifeCostList.map((item) =>
        <Grid columns={1} className={`${(item.name && item.name !== 'Monthly Cost') ? 'name value-row' : 'empty value-row'}`}>
          <Grid.Row>{item.name !== 'Monthly Cost' ? item.name : null}</Grid.Row>
        </Grid>
      )}
      { props.section === 'vol_life' && volLifeCostList.map((item) =>
        <Grid columns={1} className={`${(item.name && item.name !== 'Monthly Cost') ? 'name value-row' : 'empty value-row'}`}>
          <Grid.Row>{item.name !== 'Monthly Cost' ? item.name : null}</Grid.Row>
        </Grid>
      )}
    </Grid.Column>
  </Grid>
  );
export default LifeADDCost;

