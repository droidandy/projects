import React, { Fragment } from 'react'
import styled, { css } from 'styled-components'
import { SelectDropdown } from 'components/form'
import { PhoneLarge, Desktop } from 'components/MediaQuery'
import { sizes } from 'components/Media'
import { map } from 'lodash'

const COLORS = [ 'Other', 'Black', 'Blue', 'Brown', 'Green', 'Grey', 'Red', 'Silver', 'White', 'Yellow' ]

const carColors = (colors) => {
  return map(colors, color =>
    <ColorItem key={ color } value={ color } >{ color }</ColorItem>
  )
}

const ColorDropdown = (props) => {
  const { value } = props
  return (
    <Fragment>
      <PhoneLarge minWidth={ sizes.phoneSmall }>
        <SelectDropdown
          nooverlay
          selected={ value }
          menuHeight={ 210 }
          direction="up"
          { ...props }
        >
          { carColors(COLORS) }
        </SelectDropdown>
      </PhoneLarge>
      <Desktop>
        <SelectDropdown
          nooverlay
          selected={ value }
          menuHeight={ 210 }
          { ...props }
        >
          { carColors(COLORS) }
        </SelectDropdown>
      </Desktop>
    </Fragment>)
}

const ColorItem = styled.div`
  line-height: 40px;
  cursor: pointer;
  width: 200px;
  height: 40px;
  display: block;
  &:hover {
    background-color: rgba(246, 181, 48, 0.2);
  }
  ${props => props.value && css`
    &:before {
      content: '';
      width: 20px;
      height: 20px;
      background-color: ${props.value};
      border: solid 1px #dbdbdb;
      margin: 0 10px;
      display: inline-block;
      vertical-align: middle;
    }
  `}
`

export default ColorDropdown
