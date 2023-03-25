import React from 'react'
import styled from 'styled-components'
import { breakpoints } from 'components/Media'
import { Link } from 'react-router-dom'
import { Logo } from 'components/Logo'

const Header = () => (
  <Wrapper>
    <Link to="/"><Logo widht={ 102 } height={ 50 } /></Link>
  </Wrapper>
)

const Wrapper = styled.div`
  width: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 15px 5px;
  border-bottom: 1px solid #c0cdda;

  ${breakpoints.phoneLarge`
    padding: 25px 5px;
  `}
`

export default Header
