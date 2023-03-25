import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { Badge, Footer, Wrapper, Title } from 'components/Articles/Article'

const Numbers = ({ article: { number, publishedAt, title } }) => {
  return (
    <Wrapper bg="#4373d7">
      <Badge>Numbers</Badge>
      <NumbersTitle>
        <Number> { number } </Number>
        { title }
      </NumbersTitle>
      <Footer>
        <Date>
          { moment.utc(publishedAt).format('DD MMM h:mm a') }
        </Date>
      </Footer>
    </Wrapper>
  )
}

const NumbersTitle = styled(Title)`
  text-align:center;
  margin:auto;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  max-width: 80%;
  font-weight: 500;
`

const Number = styled.div`
  font-size: 36px;
  font-weight: bold;
`

const Date = styled.div`
  margin: auto;
`

export default Numbers
