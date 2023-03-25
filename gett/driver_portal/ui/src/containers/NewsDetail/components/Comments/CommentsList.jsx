import React, { Component } from 'react'
import styled from 'styled-components'
import { map } from 'lodash'

import { media } from 'components/Media'
import CommentsBlock from './CommentsBlock'

class CommentsList extends Component {
  renderNestedComments(comments, onAdd, addcomment, onLike, onDislike, resetComment, nested) {
    return map(comments, (comm, index) => {
      let data = []
      if (comm.content) {
        data.push(<CommentsBlock
          key={ `comment${comm.id}` }
          onAdd={ onAdd }
          addcomment={ addcomment }
          comment={ comm }
          nested={ nested }
          onLike={ onLike }
          onDislike={ onDislike }
          resetComment={ resetComment }
        />)
      }
      if (comm.comments.length > 0) {
        data.push(<Delimeter key={ `delimeter${index}` } />)
        data.push(this.renderNestedComments(comm.comments, onAdd, addcomment, onLike, onDislike, resetComment, true))
      }
      return data
    })
  }

  render() {
    const { comments, onAdd, addcomment, onLike, onDislike, resetComment } = this.props
    return (
      <Wrapper>
        {this.renderNestedComments(comments, onAdd, addcomment, onLike, onDislike, resetComment)}
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  margin-top: 40px;
`

const Delimeter = styled.div`
  width: 100%;
  height: 2px;
  margin: 25px 30px 0 75px;
  background-color: #f6f6f6;
  
  ${media.phoneLarge`
    margin-left: 0px;
  `}
`

export default CommentsList
