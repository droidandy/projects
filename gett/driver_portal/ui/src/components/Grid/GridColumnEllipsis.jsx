import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { MediaQuery } from 'components/MediaQuery'

class TitleColumn extends Component {
  render() {
    const { visibleFrom, visibleTill, flex, margin } = this.props

    return (
      <MediaQuery minWidth={ visibleFrom } maxWidth={ visibleTill }>
        <Column flex={ flex } margin={ margin }>{ this.props.children }</Column>
      </MediaQuery>
    )
  }
}

const Column = styled.div`
  font-size: 14px;
  text-align: left;
  color: #000000;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: ${props => props.flex !== undefined ? props.flex : 1};
  ${props => props.margin && css`
    margin: ${props.margin}
  `}
`

export default TitleColumn
