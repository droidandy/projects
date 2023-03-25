import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
// import { IconComments, IconWatch } from 'components/Icons'
import { IconWatch } from 'components/Icons'
import Badge from './Badge'
import Wrapper from './Wrapper'
import Footer from './Footer'
import Title from './Title'

const Article = ({ article: { commentsCount, viewsCount, publishedAt, title, imageUrl }, onClick }) => {
  return (
    <Wrapper onClick={ onClick }>
      <Badge position="left">News</Badge>
      <Image src={ imageUrl } />
      <Content>
        <ArticleTitle>
          { title }
        </ArticleTitle>
        <ArticleFooter>
          <div>
            { moment.utc(publishedAt).format('DD MMM h:mm a') }
          </div>
          <Activity>
            <CommentsCount>
              <IconWatch color="#D2DADC" />
              <Count>{ viewsCount }</Count>
            </CommentsCount>
            {/* <Counter> */}
            {/* <IconComments color="#D2DADC" /> */}
            {/* <Count>{ commentsCount } </Count> */}
            {/* </Counter> */}
          </Activity>
        </ArticleFooter>
      </Content>
    </Wrapper>
  )
}

const Content = styled.div`
  background: #fff;
`

const Image = styled.div`
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  max-width: 100%;
  min-height: 180px;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
`

const ArticleTitle = styled(Title)`
  margin: 20px;
`

const Counter = styled.div`
  display: flex;
  align-items: center;
`

const ArticleFooter = styled(Footer)`
  color: #b3b3b3;
  border-top: 2px solid #f7f7f7;
`

const Count = styled.span`
  font-size: 12px;
  margin-left: 5px;
`

const Activity = styled.div`
  display: flex;
  margin-left: auto;
`

const CommentsCount = styled(Counter)`
  margin-right: 10px;
`

export default Article
