import React from 'react'
import styled from 'styled-components'

import { media } from 'components/Media'
import Search from './Search'
import Tabs from './Tabs'

const Header = ({ query, onSearch, onSearchCategory, onSearchType }) => (
  <Wrapper>
    <Title>Drivers</Title>
    <Search
      value={ query }
      onChange={ onSearch }
      onChangeCategory={ onSearchCategory }
    />
    <Tabs
      onChange={ onSearchType }
    />
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px 15px 0px;
  height: 50px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;

  ${media.phoneLarge`
    padding: 0px;
  `}
`

const Title = styled.div`
  font-size: 36px;
  color: #303030;
  margin-left: 30px;
  flex: 1;
  
  ${media.desktopSmall`
    margin-right: 30px;
  `}
  
  ${media.tablet`
    margin-right: 50px;
  `}
`

export default Header
