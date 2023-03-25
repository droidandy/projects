import React from 'react'
import styled from 'styled-components'
import { breakpoints } from 'components/Media'
import Circle from './Circle'

const Brief = ({ invite }) => (
  <Wrapper>
    <Item>
      <Circle>1</Circle>
      <Text>
        View your driver statements
      </Text>
    </Item>

    <Item>
      <Circle>2</Circle>
      <Text>
        View your statistics
      </Text>
    </Item>

    <Item>
      <Circle>3</Circle>
      <Text>
        Update your driver profile
      </Text>
    </Item>

    <Item>
      <Circle>4</Circle>
      <Text>
        Search FAQs
      </Text>
    </Item>
  </Wrapper>
)

const Wrapper = styled.div`
  max-width: 600px;
  margin-top: 20px;
  padding: 0px 20px 0px 20px;

  ${breakpoints.phoneLarge`
    margin-top: 35px;
  `}

  ${breakpoints.desktopMedium`
    margin-top: 55px;
  `}
`

const Item = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
`

const Text = styled.div`
  font-size: 14px;
  text-align: left;
  color: #000000;
  font-weight: 400;
  margin-left: 20px;
`

export default Brief
