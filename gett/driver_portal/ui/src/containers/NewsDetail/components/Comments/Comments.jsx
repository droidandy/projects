import React, { Component } from 'react'
import styled from 'styled-components'

import { media } from 'components/Media'
import AddComment from './AddComment'
import CommentsList from './CommentsList'

class Comments extends Component {
  render() {
    const {
      onAdd,
      onLike,
      onDislike,
      user,
      news: { commentsCount },
      comments: { comments },
      addcomment,
      resetComment
    } = this.props
    return (
      <Wrapper>
        <Header>
          Comments { commentsCount }
        </Header>
        <Content>
          <AddComment
            onAdd={ onAdd }
            user={ user }
            addcomment={ addcomment }
          />
          <CommentsList
            comments={ comments }
            onAdd={ onAdd }
            addcomment={ addcomment }
            onLike={ onLike }
            onDislike={ onDislike }
            resetComment={ resetComment }
          />
        </Content>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  margin-top: 30px;
  display: flex;
  padding: 30px;
  border-radius: 6px;
  background-color: #ffffff;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  
  ${media.phoneLarge`
    padding: 15px;
  `}
  
`

const Header = styled.div`
  font-size: 24px;
  color: #303030;
`

const Content = styled.div`
  padding: 20px;
  
  ${media.phoneLarge`
    padding: 20px 0 20px 0;
  `}
`

export default Comments
