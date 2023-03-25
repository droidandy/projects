import React, { Fragment } from 'react'
import { Form, TextArea, TextField } from 'components/form'
import styled from 'styled-components'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from 'components/Dialog'
import { Button } from 'components/Button'
import { Loader } from 'components/Loader'

class Notification extends Form {
  send = this.save.bind(this)

  $render($) {
    const { active, onClose, loading } = this.props
    return (
      <Dialog onClose={ onClose } active={ active } width={ 700 }>
        <DialogHeader close>
          Email
        </DialogHeader>
        <DialogBody>
          <TextField
            { ...$('subject') }
            label="email subject"
            placeholder="Start typing"
          />
          <TextAreaStyled
            { ...$('message') }
            placeholder="Start typing"
            label="Email message"
            rows="6"
          />
        </DialogBody>
        <DialogFooterStyled>
          { loading
            ? <Loader color="#fdb924" />
            : <Fragment>
              <Save onClick={ this.send }>Send email</Save>
              <Cancel onClick={ onClose }>Cancel</Cancel>
            </Fragment>
          }
        </DialogFooterStyled>
      </Dialog>
    )
  }
}

const TextAreaStyled = styled(TextArea)`
  width: 100%;
`

const Save = styled(Button)`
  width: 140px;
  margin-right: 16px;
`

const Cancel = styled(Button)`
  width: 140px;
  background-color: #fff;
  border: solid 1px #f6b530;

  &:hover {
    background-color: #e1a62c;
  }
`

const DialogFooterStyled = styled(DialogFooter)`
  margin-top: 40px;
`

export default Notification
