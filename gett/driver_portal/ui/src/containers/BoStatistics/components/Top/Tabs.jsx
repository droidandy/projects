import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const Tabs = (props) => (
  <Wrapper>
    <div>
      <NavLinkStyled activeStyle={ { color: '#000', borderBottom: '3px solid #eeaf2e' } } to="/users">Drivers</NavLinkStyled>
      <NavLinkStyled activeStyle={ { color: '#000', borderBottom: '3px solid #eeaf2e' } } to="/bostatistics">Statistics</NavLinkStyled>
    </div>
  </Wrapper>
)

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`

const NavLinkStyled = styled(NavLink)`
  font-size: 16px;
  margin: 0 20px;
  padding-bottom: 17px;
  text-decoration: none;
  color: #a9b1ba;
`

export default Tabs
