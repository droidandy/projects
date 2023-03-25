import React, { Component } from 'react'
import styled from 'styled-components'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from 'components/Dialog'
import { media } from 'components/Media'
import { TagsField } from 'components/TagsField'
import { TextArea } from 'components/TextArea'
import { Button } from 'components/Button'
import { size, filter, isEmpty } from 'lodash'

class ShareWithDialog extends Component {
  state = {}

  componentWillMount() {
    this.clear()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active !== this.props.active) {
      this.clear()
    }
  }

  render() {
    const { statements, active, onClose } = this.props
    const { receivers, message, errors } = this.state

    return (
      <Dialog onClose={ onClose } active={ active }>
        <DialogHeader close>
          Share With ({ `${size(statements)} statements` })
        </DialogHeader>
        <DialogBody>
          <TagsField
            label="Email"
            tags={ receivers }
            onChange={ this.addReceiver }
            onRemove={ this.removeReceiver }
            errors={ errors.email }
            placeholder="Specify receivers here"
          />
          <Message
            label="Message"
            rows={ 5 }
            value={ message }
            onChange={ this.updateMessage }
            placeholder="Start typing"
          />
        </DialogBody>
        <DialogFooter>
          <Send disabled={ this.ready() } onClick={ this.send }>Send</Send>
          <Cancel onClick={ onClose }>Cancel</Cancel>
        </DialogFooter>
      </Dialog>
    )
  }

  ready = () => {
    const { receivers } = this.state
    return isEmpty(receivers)
  }

  send = () => {
    const { statements } = this.props
    const { receivers, message } = this.state

    this.props.onSend(statements, receivers, message)
    this.props.onClose()
  }

  clear = () => {
    this.setState({ receivers: [], message: '', errors: { email: [] } })
  }

  updateMessage = (message) => {
    this.setState({ message })
  }

  addReceiver = (receiver) => {
    if (isEmpty(receiver)) {
      this.setState({ errors: { email: [] } })
      return
    }

    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (!regexp.test(receiver)) {
      this.setState(state => ({
        errors: {
          ...state.errors,
          email: [ 'Please, enter correct email' ]
        }
      }))

      return
    }

    this.setState(state => ({
      ...state,
      receivers: [ ...state.receivers, receiver ],
      errors: { email: [] }
    }))
  }

  removeReceiver = (receiver) => {
    this.setState(state => ({
      ...state,
      receivers: filter(state.receivers, r => r !== receiver)
    }))
  }
}

const Message = styled(TextArea)`
  margin-top: 30px;
`

const Send = styled(Button)`
  margin-right: 20px;
`

const Cancel = styled(Button)`
  background-color: #fff;
  border: solid 1px #f6b530;
  margin-right: 20px;

  &:hover {
    background-color: #e1a62c;
  }

  ${media.phoneLarge`
    margin-right: 0px;
  `}
`

export default ShareWithDialog
