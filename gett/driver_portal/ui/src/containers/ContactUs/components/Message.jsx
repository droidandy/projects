import React, { Component } from 'react'
import styled from 'styled-components'

import { media } from 'components/Media'

import { Button } from 'components/Button'
import { Loader } from 'components/Loader'

class Message extends Component {
  state = {
    message: ''
  }

  onChange = (e) => {
    this.setState({
      message: e.target.value
    })
  }

  onSend = () => {
    const { onSend } = this.props
    const { message } = this.state
    if (onSend) {
      onSend({ message })
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.loading !== newProps.loading) {
      this.setState({ message: '' })
    }
  }

  render() {
    const { className, loading } = this.props
    const { message } = this.state

    return <Wrapper className={ className }>
      <Reminder>
        Have you checked our FAQs? Please take a look in our FAQ section to see if your query is covered.
        You can find it at the top of this side.
      </Reminder>
      <Label>
        Message
      </Label>
      <Text
        value={ message }
        onChange={ this.onChange } />
      {loading ? <LoaderStyled color="#FDB924" />
        : <ButtonStyled
          disabled={ message.length < 1 }
          onClick={ this.onSend }>
        Send
        </ButtonStyled>}
    </Wrapper>
  }
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Label = styled.div`
  font-size: 10px;
  font-weight: bold;
  margin-top: 10px;
  color: #a9b1ba;
  text-transform: uppercase;
  align-self: flex-start;
`

const Text = styled.textarea`
  width:100%;
  min-width: 300px;
  border-radius: 4px;
  border: solid 1px #a8a8b5;
  margin-top: 6px;
  min-height: 100px;
  resize: none;
  
  ${media.phoneLarge`
    min-width: 200px;
  `}
`

const ButtonStyled = styled(Button)`
  margin-top: 30px;
  font-size: 16px;
  width: 140px;
`

const LoaderStyled = styled(Loader)`
  margin-top: 30px;
`

const Reminder = styled.div`
  margin-bottom: 20px;
  text-align: justify;
`
export default Message
