import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
// import { IconComments } from 'components/Icons'
import { Badge, Footer, Wrapper, Title } from 'components/Articles/Article'

const Simple = ({ article: { commentsCount, publishedAt, title }, onClick }) => {
  return (
    <Wrapper onClick={ onClick } bg="ffffff">
      <Badge position="left">News</Badge>
      <NumbersTitle>
        { title }
      </NumbersTitle>
      <SimpleFooter>
        <div>
          { moment.utc(publishedAt).format('DD MMM h:mm a') }
        </div>
        {/* <Counter> */}
        {/* <IconComments color="#e6e6e6" /> */}
        {/* <Count>{ commentsCount }</Count> */}
        {/* </Counter> */}
      </SimpleFooter>
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

// const Counter = styled.div`
//   display: flex;
//   align-items: center;
// `

const SimpleFooter = styled(Footer)`
  color: #b3b3b3;
  border-top: 2px solid #f7f7f7;
`

// const Count = styled.span`
//   font-size: 12px;
//   margin-left: 5px;
// `

export default Simple
