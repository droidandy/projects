import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { MediaQuery } from 'components/MediaQuery'

class GridHeader extends Component {
  render() {
    const { visibleFrom, visibleTill, flex, margin } = this.props
    return (
      <MediaQuery minWidth={ visibleFrom } maxWidth={ visibleTill }>
        <Header flex={ flex } margin={ margin }>{ this.props.children }</Header>
      </MediaQuery>
    )
  }
}

const Header = styled.div`
  font-size: 10px;
  font-weight: 500;
  text-align: left;
  color: #a9b1ba;
  text-transform: uppercase;
  flex: ${props => props.flex !== undefined ? props.flex : 1};
  ${props => props.margin && css`
    margin: ${props.margin}
  `}
`

export default GridHeader
