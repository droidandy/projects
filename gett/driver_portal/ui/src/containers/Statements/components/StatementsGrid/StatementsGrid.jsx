import React from 'react'
import { map } from 'lodash'
import { Grid, GridHeaders, GridHeader, GridBody } from 'components/Grid'
import { sizes } from 'components/Media'
import { Checkbox } from 'components/Checkbox'
import StatementRow from './StatementRow'

const StatementsGrid = (props) => (
  <Grid>
    <GridHeaders>
      <GridHeader flex={ 1 } visibleTill={ sizes.phoneLarge }>
        <Checkbox
          checked={ props.isSelected('all') }
          onClick={ () => props.select('all') }
        />
      </GridHeader>
      <GridHeader flex={ 0.5 } visibleFrom={ sizes.phoneLarge }>
        <Checkbox
          checked={ props.isSelected('all') }
          onClick={ () => props.select('all') }
        />
      </GridHeader>
      <GridHeader flex={ 1 } visibleTill={ sizes.phoneLarge }>Week</GridHeader>
      <GridHeader flex={ 0.5 } visibleFrom={ sizes.phoneLarge } >Week</GridHeader>
      <GridHeader flex={ 2.5 } visibleFrom={ sizes.phoneLarge }>
        Period
      </GridHeader>
      <GridHeader flex={ 1 } visibleFrom={ sizes.phoneLarge }>
        Statement ID
      </GridHeader>
      <GridHeader visibleFrom={ sizes.tablet }>
        Rides
      </GridHeader>
      <GridHeader visibleFrom={ sizes.tablet }>
        Tips
      </GridHeader>
      <GridHeader margin="0 5px 0 0" visibleFrom={ sizes.tablet }>
        Adjustments
      </GridHeader>
      <GridHeader visibleFrom={ sizes.tablet }>
        VAT
      </GridHeader>
      <GridHeader margin="0 5px 0 0" visibleFrom={ sizes.tablet }>
        Commission
      </GridHeader>
      <GridHeader visibleFrom={ sizes.tablet }>
        Cash
      </GridHeader>
      <GridHeader visibleFrom={ sizes.tablet }>
        Total
      </GridHeader>
      <GridHeader flex={ 3 } visibleTill={ sizes.tablet - 1 }>
        Total
      </GridHeader>
      <GridHeader>
        Status
      </GridHeader>
      <GridHeader flex={ 2 } visibleTill={ sizes.tablet - 1 } />
      <GridHeader flex={ 0.5 } />
    </GridHeaders>
    <GridBody>
      {
        map(props.statements, statement => (
          <StatementRow
            key={ statement.id }
            statement={ statement }
            selected={ props.isSelected('all') || props.isSelected(statement.id) }
            onSelect={ () => props.select(statement.id) }
            onClick={ props.toggle }
            expanded={ props.expanded }
            onEmailMe={ props.onEmailMe }
            onShareWith={ props.onShareWith }
            onDownloadPDF={ props.onDownloadPDF }
          />
        ))
      }
    </GridBody>
  </Grid>
)

export default StatementsGrid
