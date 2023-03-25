import React from 'react'
import styled from 'styled-components'
import { Button } from 'components/Button'
import { SearchField } from 'components/SearchField'
import { media } from 'components/Media'

const Header = ({ query, onSearch, create }) => (
  <Wrapper>
    <Title>Drivers</Title>
    <Search
      value={ query }
      onChange={ onSearch }
    />
    <Button onClick={ create }>Create new User</Button>
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
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
  margin-right: 100px;
  flex: 1;

  ${media.phoneLarge`
    margin-left: 0;
    margin-right: 10px;
  `}

`

const Search = styled(SearchField)`
  width: 290px;
  margin-right: 20px;
`

export default Header
