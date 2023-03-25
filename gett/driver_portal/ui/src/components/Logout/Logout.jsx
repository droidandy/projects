import React from 'react'
import styled from 'styled-components'

import { IconLogout } from 'components/Icons'

const Logout = ({ onClick, className }) => (
  <Wrapper className={ className } onClick={ onClick }>
    <LogoutStyled width="14" height="16" />
  </Wrapper>
)

const Wrapper = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-left: 1px solid #d2dadc;
  cursor: pointer;
  
  &:hover {
    background-color: #f6b530;
  }
  
  &:active {
    background-color: #e1a62c;
  }
`

const LogoutStyled = styled(IconLogout)`
  margin: 0 auto;
  cursor: pointer;
`

export default Logout
