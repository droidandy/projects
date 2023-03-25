import React, { Component } from 'react'
import styled from 'styled-components'

class Grid extends Component {
  render() {
    return (
      <Table>
        { this.props.children }
      </Table>
    )
  }
}

const Table = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default Grid
