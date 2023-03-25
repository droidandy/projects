import React, { Component } from 'react'
import styled from 'styled-components'
import { Paginator } from 'components/Paginator'
import { PerPageSelect } from 'components/PerPageSelect'
import Info from './Info'

class Bottom extends Component {
  render() {
    const { total, page, perPage, onChange } = this.props

    return (
      <Wrapper>
        <Info label="Total" value={ total } />
        {
          total && <Paginator
            page={ page }
            perPage={ perPage }
            total={ total }
            onClick={ this.selectPage }
          />
        }
        <Info label="Per page">
          <PerPageSelect perPage={ perPage } onChange={ onChange } />
        </Info>
      </Wrapper>
    )
  }

  selectPage = (page) => {
    this.props.onChange({ page })
  }
}

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  background-color: #fff;
  padding: 15px 30px;
  box-sizing: border-box;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  height: 70px;
  z-index: 2;
`
export default Bottom
