import React, { Component } from 'react'
import styled, { css } from 'styled-components'

import { media, sizes } from 'components/Media'
import { Desktop, PhoneLarge } from 'components/MediaQuery'
import { Avatar } from 'components/Avatar'
import { Button } from 'components/Button'
import { IconLike, IconDislike, IconWriteComment } from 'components/Icons'

import AddComment from './AddComment'

class CommentsBlock extends Component {
  state = {
    showAdd: false
  }

  render() {
    const { comment, nested, onChange, addcomment, onLike, onDislike } = this.props
    const { showAdd } = this.state

    return (
      <Wrapper nested={ nested }>
        <Desktop>
          <Avatar width={ 50 } height={ 50 } user={ comment && comment.user } />
        </Desktop>
        <PhoneLarge maxWidth={ sizes.phoneLarge } minWidth={ 0 }>
          <Phone>
            <Avatar width={ 50 } height={ 50 } user={ comment && comment.user } />
            <Name>
              { comment && comment.user && comment.user.name }
            </Name>
          </Phone>
        </PhoneLarge>
        <Body>
          <Desktop>
            <Name>
              { comment && comment.user && comment.user.name }
            </Name>
          </Desktop>
          <Content>
            { comment && comment.content }
          </Content>
          <Buttons>
            { !nested &&
            <Comment onClick={ this.addComment }>
              <IconWriteComment />
              Comment
            </Comment>
            }
            <Likes>
              <IconWrapper onClick={ () => onLike(comment.id, comment.currentUserValue) }>
                <IconLikeStyled color={ comment.currentUserValue && comment.currentUserValue === 1 ? '#74818F' : '#D2DADC' } />
              </IconWrapper>
              <LikesCount>
                { comment.likesCount - comment.dislikesCount }
              </LikesCount>
              <IconWrapper onClick={ () => onDislike(comment.id, comment.currentUserValue) }>
                <IconDislikeStyled color={ comment.currentUserValue && comment.currentUserValue === -1 ? '#74818F' : '#D2DADC' } />
              </IconWrapper>
            </Likes>
          </Buttons>
          { !nested && showAdd && <AddCommentStyled
            onChange={ onChange }
            onAdd={ (content) => this.onAdd(content, comment.id) }
            addcomment={ addcomment }
            onCancel={ this.cancelComment }
            showCancel
          /> }
        </Body>
      </Wrapper>
    )
  }

  addComment = () => {
    this.setState({ showAdd: true }, this.props.resetComment)
  }

  cancelComment = () => {
    this.setState({ showAdd: false })
  }

  onAdd = (content, nestedId) => {
    this.setState({
      showAdd: false
    }, this.props.onAdd(content, nestedId))
  }
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top: 30px;
  ${media.phoneLarge`
    flex-direction: column;
  `}

  ${props => props.nested && css`
    margin-left: 75px;
    ${media.phoneLarge`
      margin-left: 30px;
    `}
  `}
`

const Body = styled.div`
  margin-left: 25px;
  width: 100%;

  ${media.phoneLarge`
    margin-left: 0;
  `}
`

const Buttons = styled.div`
  display: flex;
  margin: 20px 0 0 0;
`

const Comment = styled(Button)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 120px;
  border: 0;
  background-color: #fff;
  color: #b3b3b3;
  padding: 10px;
  margin-right: 25px;

  &:hover {
    background-color: #74818F;
    color: #FFF;
  }
`

const Content = styled.div`
  margin: 0;
  width: 100%;
  font-size: 14px;
  line-height: 2.14;
  margin-top: 10px;
`

const Name = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 2.14;

  ${media.phoneLarge`
    margin: 5px 0 0 14px;
  `}
`

const Likes = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  width: 80px;
`

const Phone = styled.div`
  display:flex;
`

const IconWrapper = styled.div`
  height: 20px;
`

const LikesCount = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #b6b6b6;
  line-height: 2.31;
`

const IconLikeStyled = styled(IconLike)`
  cursor: pointer;
`

const IconDislikeStyled = styled(IconDislike)`
  cursor: pointer;
`

const AddCommentStyled = styled(AddComment)`
  margin: 10px 0 0 -25px;
`

export default CommentsBlock
