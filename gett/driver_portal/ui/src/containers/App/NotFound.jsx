import React from 'react'
import styled from 'styled-components'
import { map } from 'lodash'

const links = {
  home: '/',
  ru: '/RU',
  uk: '/UK',
  il: '/IL',
  us: '/US'
}
const NotFound = () => (
  <Container>
    <Header>404</Header>
    <SubHeader>Oops! It looks like you are lost</SubHeader>
    <Description>
      Luckily, we’re experts at getting you to the right place. Try one of these links instead:
    </Description>
    <Fallbacks>
      { map(links, (href, name) => <Fallback key={ name } href={ href }>{ name }</Fallback>) }
    </Fallbacks>
  </Container>
)

const Fallbacks = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Fallback = styled.a`
  margin: 10px 20px;
  text-transform uppercase;
`

const Header = styled.h1`
  display: block;
  font-size: 10em;
  line-height: 1;
`

const SubHeader = styled.h2`
  display: block;
  text-transform: uppercase;
  color: #aaa;
  font-weight: 100;
  font-size: 1.3em;
  margin-bottom: 30px;
`

const Description = styled.div`
  display: block;
  color: #aaa;
  margin-bottom: 40px;
`

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`

export default NotFound
