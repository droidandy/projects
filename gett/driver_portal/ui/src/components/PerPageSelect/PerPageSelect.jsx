import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { SelectDropdown } from 'components/SelectDropdown'
import { IconCheckMark } from 'components/Icons'

const PER_PAGE = [5, 10, 20, 50, 100]

class PerPageSelect extends Component {
  renderItems() {
    return PER_PAGE.map(value => {
      return (
        <SelectItem key={ value } value={ value }>
          { value }
          <IconCheckMark color="#f6b530" />
        </SelectItem>
      )
    })
  }

  selectPerPage = (perPage) => {
    this.props.onChange({ perPage })
  }

  render() {
    const { perPage } = this.props
    return (
      <SelectDropdown
        width={ 80 }
        bottom={ 40 }
        selected={ perPage }
        onChange={ this.selectPerPage }
        nooverlay
      >
        { this.renderItems() }
      </SelectDropdown>
    )
  }
}

const SelectItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
  padding: 10px 15px;

  &:hover {
    background-color: rgba(246, 181, 48, 0.2);
  }
  
  ${props => props.selected ? css`
    svg { display: block; }
  ` : css`
    svg { display: none; }
  `};
`

export default PerPageSelect
