import React from 'react'
import styled from 'styled-components'
import { Logout } from 'components/Logout'

const Profile = ({ name, onLogout }) => (
  <Wrapper>
    <Name>{ name }</Name>
    <Logout onClick={ onLogout } />
  </Wrapper>
)

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const Name = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  margin-right: 30px;
`

export default Profile
