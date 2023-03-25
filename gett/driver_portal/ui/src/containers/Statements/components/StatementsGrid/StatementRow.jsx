import React from 'react'
import styled from 'styled-components'
import { Collapse } from 'components/Collapse'
import { MediaQuery } from 'components/MediaQuery'
import { sizes } from 'components/Media'
import { GridRow, GridColumn, Dots, Expander } from 'components/Grid'
import { Checkbox } from 'components/Checkbox'
import { Money } from 'components/Money'
import { Details } from './Details'
import { Actions } from './Actions'
import Period from './Period'
import Status from './Status'

const StatementRow = (props) => {
  const { statement, onSelect } = props

  return (
    <div>
      <MediaQuery maxWidth={ sizes.tablet - 1 }>
        <Collapse
          collapsed={ collapse => (
            <Row
              { ...props }
              onSelect={ statement => onSelect(statement) }
              onClick={ collapse.toggle }
              expanded={ collapse.expanded }
            />
          ) }
          expanded={ () => (
            <MediaQuery maxWidth={ sizes.tablet - 1 }>
              <Details
                statement={ statement }
              />
            </MediaQuery>
          ) }
        />
      </MediaQuery>
      <MediaQuery minWidth={ sizes.tablet }>
        <Row { ...props } />
      </MediaQuery>
    </div>
  )
}

const Row = ({
  statement,
  selected,
  onClick,
  onSelect,
  onEmailMe,
  onShareWith,
  onDownloadPDF,
  expanded
}) => (
  <GridRow onClick={ onClick } expanded={ expanded }>
    <GridColumn flex={ 1 } visibleTill={ sizes.phoneLarge }>
      <Checkbox
        checked={ selected }
        onClick={ () => onSelect(statement) }
      />
    </GridColumn>
    <GridColumn flex={ 0.5 } visibleFrom={ sizes.phoneLarge }>
      <Checkbox
        checked={ selected }
        onClick={ () => onSelect(statement) }
      />
    </GridColumn>
    <GridColumn flex={ 1 } visibleTill={ sizes.phoneLarge }>
      { statement.weekNumber }
    </GridColumn>
    <GridColumn flex={ 0.5 } visibleFrom={ sizes.phoneLarge }>
      { statement.weekNumber }
    </GridColumn>
    <GridColumn flex={ 2.5 } visibleFrom={ sizes.phoneLarge }>
      <Period from={ statement.from } to={ statement.to } />
    </GridColumn>
    <GridColumn flex={ 1 } visibleFrom={ sizes.phoneLarge }>
      { statement.id }
    </GridColumn>
    <GridColumn visibleFrom={ sizes.tablet }>
      <Money value={ statement.rides } />
    </GridColumn>
    <GridColumn visibleFrom={ sizes.tablet }>
      <Money value={ statement.tips } />
    </GridColumn>
    <GridColumn margin="0 5px 0 0" visibleFrom={ sizes.tablet }>
      <Money value={ statement.adjustments } />
    </GridColumn>
    <GridColumn visibleFrom={ sizes.tablet }>
      <Money value={ statement.vat } />
    </GridColumn>
    <GridColumn margin="0 5px 0 0" visibleFrom={ sizes.tablet }>
      <Money value={ statement.commission } />
    </GridColumn>
    <GridColumn visibleFrom={ sizes.tablet }>
      <Bold><Money value={ statement.cash } /></Bold>
    </GridColumn>
    <GridColumn visibleFrom={ sizes.tablet }>
      <Bold><Money value={ statement.total } /></Bold>
    </GridColumn>
    <GridColumn flex={ 3 } visibleTill={ sizes.tablet - 1 }>
      <Bold><Money value={ statement.total } /></Bold>
    </GridColumn>
    <GridColumn>
      <Status />
    </GridColumn>
    <GridColumn flex={ 2 } visibleTill={ sizes.tablet - 1 }>
      <Expander expanded={ expanded } />
    </GridColumn>
    <GridColumn flex={ 0.5 }>
      <Actions
        statements={ [ statement ] }
        onEmailMe={ onEmailMe }
        onShareWith={ onShareWith }
        onDownloadPDF={ onDownloadPDF }
        trigger={ <Dots /> }
      />
    </GridColumn>
  </GridRow>
)

const Bold = styled.span`
  font-weight: bold;
`

export default StatementRow
