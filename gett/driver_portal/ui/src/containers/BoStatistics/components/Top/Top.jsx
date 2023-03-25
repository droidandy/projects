import React from 'react'
import styled from 'styled-components'
import Logo from './Logo'
import Profile from './Profile'
import Tabs from './Tabs'

const Top = ({ name, onLogout }) => (
  <Wrapper>
    <Logo />
    <VerticalLine />
    <Title>Driver Portal</Title>
    <Tabs />
    <Profile name={ name } onLogout={ onLogout } />
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  min-height: 60px;
  padding-left: 30px;
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
  margin-bottom: 25px;
`

const VerticalLine = styled.div`
  width: 1px;
  height: 34px;
  margin-left: 20px;
  background-color: #a9b1ba;
`

const Title = styled.div`
  font-size: 20px;
  margin-left: 20px;
  color: #a9b1ba;
`

export default Top
