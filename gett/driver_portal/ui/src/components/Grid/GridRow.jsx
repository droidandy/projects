import React, { Component } from 'react'
import styled, { css } from 'styled-components'

class GridRow extends Component {
  render() {
    const { onClick, expanded, className } = this.props

    return (
      <Row
        className={ className }
        expanded={ expanded }
        onClick={ onClick }>
        { this.props.children }
      </Row>
    )
  }
}

const Row = styled.div`
  display: flex;
  align-items: center;
  border-radius: 4px;
  margin-bottom: 5px;
  background-color: #ffffff;
  padding: 15px;

  ${props => props.expanded && css`
    margin-bottom: 0;
  `}

  ${props => props.onClick && css`
    cursor: pointer;
  `}
`

export default GridRow
