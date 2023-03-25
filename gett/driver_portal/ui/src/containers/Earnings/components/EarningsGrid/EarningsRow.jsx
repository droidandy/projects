import React from 'react'
import styled from 'styled-components'
import { Collapse } from 'components/Collapse'
import { sizes } from 'components/Media'
import { GridRow, GridColumn, Expander, Dots } from 'components/Grid'
import { Checkbox } from 'components/Checkbox'
import { Money } from 'components/Money'
import Date from './Date'
import Time from './Time'
import Actions from './Actions'
import ExpandEarnings from './ExpandEarnings'

const EarningsRow = (props) => {
  const { earning, selected, onSelect, onEmailMe, onShareWith, onDownloadCSV, loadDetails, details, id, onStatementId } = props
  return (
    <div>
      <Collapse
        collapsed={ props => (
          <Row
            earning={ earning }
            selected={ selected }
            onSelect={ earning => onSelect(earning) }
            onClick={ earning.orderId ? () => props.toggle() : null }
            onEmailMe={ onEmailMe }
            onShareWith={ onShareWith }
            onDownloadCSV={ onDownloadCSV }
            expanded={ props.expanded }
          />
        ) }
        expanded={ (props) => (
          <ExpandEarnings
            { ...props }
            loadDetails={ loadDetails }
            details={ details }
            data={ earning }
            onStatementId={ onStatementId }
            id={ id }
          />
        ) }
      />
    </div>
  )
}

const Row = ({
  earning,
  selected,
  onClick,
  onSelect,
  onEmailMe,
  onShareWith,
  onDownloadCSV,
  expanded
}) => (
  <GridRow onClick={ onClick } expanded={ expanded }>
    <GridColumn visibleFrom={ sizes.phoneLarge }>
      <Checkbox
        checked={ selected }
        onClick={ () => onSelect(earning) }
      />
    </GridColumn>
    <GridColumn flex={ 2 } visibleFrom={ sizes.phoneLarge }>
      <Date value={ earning.startedAt } />
    </GridColumn>
    <GridColumn flex={ 2 } visibleFrom={ sizes.phoneLarge }>
      <Time value={ earning.startedAt } />
    </GridColumn>
    <GridColumn flex={ 4 } visibleFrom={ sizes.phoneLarge }>
      <Bold><Money value={ earning.total } /></Bold>
    </GridColumn>
    <GridColumn flex={ 3 } visibleTill={ sizes.phoneLarge }>
      <MobileCheckbox>
        <Checkbox
          checked={ selected }
          onClick={ () => onSelect(earning) }
        />
      </MobileCheckbox>
      <Date value={ earning.startedAt } />
    </GridColumn>
    <GridColumn flex={ 2 } visibleTill={ sizes.phoneLarge }>
      <Mobile>
        <Bold><Money value={ earning.total } /></Bold>
      </Mobile>
      <Time value={ earning.startedAt } />
    </GridColumn>
    { earning.orderId ? <GridColumn visibleFrom={ sizes.phoneLarge } flex={ 1 }>
      <Expander expanded={ expanded } label />
    </GridColumn>
      : <GridColumn visibleFrom={ sizes.phoneLarge } />
    }
    <GridColumn visibleFrom={ sizes.phoneLarge }>
      <Actions
        earnings={ [ earning ] }
        onEmailMe={ onEmailMe }
        onShareWith={ onShareWith }
        onDownloadCSV={ onDownloadCSV }
        trigger={ <Dots /> }
      />
    </GridColumn>
    <GridColumn visibleTill={ sizes.phoneLarge }>
      <Mobile>
        <Actions
          earnings={ [ earning ] }
          onEmailMe={ onEmailMe }
          onShareWith={ onShareWith }
          onDownloadCSV={ onDownloadCSV }
          trigger={ <Dots /> }
        />
      </Mobile>
      { earning.orderId && <ExpanderStyled expanded={ expanded } /> }
    </GridColumn>
  </GridRow>
)

const Bold = styled.span`
  font-size: 18px;
  font-weight: bold;
`

const Mobile = styled.div`
  margin-bottom: 18px;
`

const MobileCheckbox = styled.div`
  margin-bottom: 20px;
`

const ExpanderStyled = styled(Expander)`
  justify-content: flex-end;
`

export default EarningsRow
