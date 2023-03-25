import React, { Component } from 'react'
import styled, { css } from 'styled-components'

import { media } from 'components/Media'
import { Avatar } from 'components/Avatar'
import { Button } from 'components/Button'
import { TextArea } from 'components/TextArea'

class AddComments extends Component {
  state = {
    addcomment: {
      content: ''
    },
    errors: {}
  }

  render() {
    const { showCancel, user, className, addcomment: { loading } } = this.props
    const addcomment = {
      ...this.props.addcomment,
      ...this.state.addcomment,
      errors: {
        ...this.props.addcomment.errors,
        ...this.state.errors
      }
    }

    return (
      <Wrapper className={ className }>
        <AvatarStyled width={ 50 } height={ 50 } user={ user } />
        <Body nested={ user }>
          <Message
            value={ addcomment.content }
            onChange={ this.onChange }
            placeholder="Leave Your Comment"
            errors={ addcomment.errors && addcomment.errors.content }
          />
          <Buttons>
            {!loading && <Comment onClick={ this.onAdd }>
              Comment
            </Comment>}
            { showCancel && <Cancel onClick={ this.onCancel } >
              Cancel
            </Cancel> }
          </Buttons>
        </Body>
      </Wrapper>
    )
  }

  onChange = (content) => {
    this.setState(state => ({
      ...state,
      addcomment: { ...state.addcomment, content },
      errors: { content: [] }
    }))
  }

  onAdd = () => {
    const { content } = this.state.addcomment
    if (content.length > 0) {
      this.setState(state => ({
        ...state,
        addcomment: { content: '' },
        errors: {}
      }), () => this.props.onAdd(content))
    } else {
      this.setState({
        errors: {
          content: ['Content must be filled']
        }
      })
    }
  }

  onCancel = () => {
    this.setState(state => ({
      ...state,
      addcomment: { content: '' },
      errors: { content: [] }
    }), this.props.onCancel)
  }
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;

  ${media.phoneLarge`
    flex-direction: column;
  `}
`

const AvatarStyled = styled(Avatar)`
  margin: 5px 0 0 0;

  ${media.phoneLarge`
    margin: 0 0 10px 0;
  `}
`

const Body = styled.div`
  margin-left: 25px;
  width: 100%;

  ${media.phoneLarge`
    ${props => props.nested && css`
      margin-left: 0px;
    `}
  `}
`

const Buttons = styled.div`
  display: flex;
  margin: 20px 0 0 0;
`

const Comment = styled(Button)`
  align-items: flex-start;
  width: 120px;
`

const Cancel = styled(Button)`
  background-color: #fff;
  border: solid 1px #f6b530;
  margin-left: 20px;
  width: 120px;

  &:hover {
    background-color: #e1a62c;
  }
`

const Message = styled(TextArea)`
  margin: 0;
  width: 100%;
`

export default AddComments
