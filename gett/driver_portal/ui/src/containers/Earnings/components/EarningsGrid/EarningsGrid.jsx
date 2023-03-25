import React from 'react'
import { map } from 'lodash'
import { Grid, GridHeaders, GridHeader, GridBody } from 'components/Grid'
import { sizes } from 'components/Media'
import { Checkbox } from 'components/Checkbox'
import EarningsRow from './EarningsRow'

const EarningsGrid = (props) => (
  <Grid>
    <GridHeaders visibleFrom={ sizes.phoneLarge }>
      <GridHeader>
        <Checkbox
          checked={ props.isSelected('all') }
          onClick={ () => props.select('all') }
        />
      </GridHeader>
      <GridHeader flex={ 2 }>
        Date
      </GridHeader>
      <GridHeader flex={ 2 }>
        Time
      </GridHeader>
      <GridHeader flex={ 4 }>
        Total
      </GridHeader>
      <GridHeader />
      <GridHeader />
    </GridHeaders>
    <GridBody>
      {
        map(props.earnings, (earning, index) => (
          <EarningsRow
            key={ `Earnings-${earning.externalId}` }
            id={ index }
            earning={ earning }
            details={ props.earningsDetails[earning.orderId] }
            selected={ props.isSelected('all') || props.isSelected(earning.externalId) }
            onSelect={ () => props.select(earning.externalId) }
            loadDetails={ props.loadDetails }
            onEmailMe={ props.onEmailMe }
            onShareWith={ props.onShareWith }
            onDownloadCSV={ props.onDownloadCSV }
            onStatementId={ props.onStatementId }
          />
        ))
      }
    </GridBody>
  </Grid>
)

export default EarningsGrid
