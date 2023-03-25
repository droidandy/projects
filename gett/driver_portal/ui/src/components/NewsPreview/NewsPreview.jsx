import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import DOMPurify from 'dompurify'
import moment from 'moment'

import { media } from 'components/Media'
// import { IconWatch, IconComments } from 'components/Icons'
import { IconWatch } from 'components/Icons'

const FORMAT_TIME = 'DD MMM YYYY LT'

DOMPurify.addHook('beforeSanitizeElements', function(currentNode, data, config) {
  if (currentNode && currentNode.className && currentNode.className === 'editorImage') {
    currentNode.classList.remove('editorImage')
    currentNode.style.backgroundRepeat = 'no-repeat'
    currentNode.style.backgroundSize = 'cover'
    currentNode.style.width = currentNode.style.width || '150px'
    currentNode.style.height = currentNode.style.height || '150px'
    currentNode.style.margin = '0'
    currentNode.style.maxWidth = '100%'
  }
  return currentNode
})

class NewsPreview extends Component {
  render() {
    // const { news: { imageUrl, title, publishedAt, viewsCount, commentsCount, content }, image } = this.props
    const { news: { imageUrl, title, publishedAt, viewsCount, content }, image } = this.props
    return (
      <Wrapper>
        <Header image={ (image && image.croppedImage) || imageUrl }>
          <Title>{ title }</Title>
          <HeaderBottom>
            <Time>{ moment.utc(publishedAt).format(FORMAT_TIME) }</Time>
            <CounterWrapper>
              <ViewsCounter>
                <IconWatch color="#fff" />
                <Count>{ viewsCount } </Count>
              </ViewsCounter>
              {/* <Counter> */}
              {/* <IconComments color="#fff" /> */}
              {/* <Count>{ commentsCount }</Count> */}
              {/* </Counter> */}
            </CounterWrapper>
          </HeaderBottom>
        </Header>
        <Content dangerouslySetInnerHTML={ { __html: DOMPurify.sanitize(content) } } />
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  display: flex;
  background-color: #fff;
  flex-direction: column;
  align-items: center;
  border-radius: 6px;
  width: 100%;
  max-width: 1100px;
`

const Header = styled.div`
  position: relative;
  min-height: 510px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width 1100px;
  
  ${props => props.image && css`
    background-image: url(${props => props.image});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 50%;
  `}
  
  ${media.phoneLarge`
    border-radius: 0;
  `}
`

const Title = styled.div`
  text-align: center;
  margin: auto;
  font-size: 36px;
  line-height: 1.25;
  font-weight: 500;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  
  ${media.phoneLarge`
    font-size: 24px;
    line-height: 1.5;
  `}
`

const HeaderBottom = styled.div`
  position: absolute;
  bottom: 65px;
  display: flex;
  align-items: center;
  flex-direction: column;
`

const Time = styled.div`
  margin-bottom: 50px;
  font-size: 14px;
  font-weight: 500;
  line-height: 2.14;
  color: #ffffff;
`

const CounterWrapper = styled.div`
  display: flex;
  align-items: center;
`

const Counter = styled.div`
  display: flex;
  align-items: center;
`

const ViewsCounter = styled(Counter)`
  margin-right: 25px;
`

const Count = styled.div`
  font-size: 12px;
  font-weight: bold;
  line-height: 2.5;
  color: #fff;
  margin-left: 5px;
`

const Content = styled.div`
  padding: 40px;
  width: 100%;
  word-wrap: break-word;
  
  ${media.phoneLarge`
    padding: 15px;
  `}
`

export default NewsPreview
