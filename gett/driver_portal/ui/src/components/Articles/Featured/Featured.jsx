import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
// import { IconWatch, IconComments } from 'components/Icons'
import { IconWatch } from 'components/Icons'
import { Badge, Footer, Wrapper, Title } from 'components/Articles/Article'

const Featured = ({ article: { commentsCount, viewsCount, publishedAt, title, imageUrl }, onClick }) => {
  return (
    <Wrapper onClick={ onClick } src={ imageUrl }>
      <Badge>Reportage</Badge>
      <FeaturedTitle>
        { title }
      </FeaturedTitle>
      <Footer>
        <Date>
          { moment.utc(publishedAt).format('DD MMM h:mm a') }
        </Date>
        <Activity>
          <CommentsCount>
            <IconWatch color="#ffffff" />
            <Count>{ viewsCount }</Count>
          </CommentsCount>
          {/* <Counter> */}
          {/* <IconComments color="#ffffff" /> */}
          {/* <Count>{ commentsCount } </Count> */}
          {/* </Counter> */}
        </Activity>
      </Footer>
    </Wrapper>
  )
}

const FeaturedTitle = styled(Title)`
  text-align:center;
  margin:auto;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: 500;
  max-width: 80%;
  font-weight: 500;
`

const Date = styled.div`
  margin-right: auto;
`

const Activity = styled.div`
  display: flex;
  margin-left: auto;
`

const Counter = styled.div`
  display: flex;
  align-items: center;
`

const CommentsCount = styled(Counter)`
  margin-right: 10px;
`

const Count = styled.span`
  font-size: 12px;
  margin-left: 5px;
`

export default Featured
