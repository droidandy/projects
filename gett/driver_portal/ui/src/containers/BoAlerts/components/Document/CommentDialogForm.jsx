import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, TextArea } from 'components/form'
import styled from 'styled-components'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from 'components/Dialog'
import { Button } from 'components/Button'
import { Loader } from 'components/Loader'

class CommentDialogForm extends Form {
  static propTypes = {
    active: PropTypes.bool,
    onConfirm: PropTypes.func,
    onClose: PropTypes.func
  }

  validations = {
    comment: 'presence'
  }

  save = this.save.bind(this)

  $render($) {
    const { active, onClose, loading } = this.props

    return (
      <Dialog onClose={ onClose } active={ active } width={ 700 }>
        <DialogHeader close>Rejection comment</DialogHeader>
        <DialogBodyStyled>
          <TextAreaStyled
            { ...$('comment') }
            placeholder="Start typing"
            rows="6"
          />
        </DialogBodyStyled>
        <DialogFooterStyled>
          { loading
            ? <Loader color="#fdb924" />
            : <Fragment>
              <Save onClick={ this.save }>Save comment</Save>
              <Cancel onClick={ onClose }>Cancel</Cancel>
            </Fragment>
          }
        </DialogFooterStyled>
      </Dialog>
    )
  }
}

const DialogBodyStyled = styled(DialogBody)`
  padding: 30px 0 0;
`

const TextAreaStyled = styled(TextArea)`
  margin: 0 50px;
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

export default CommentDialogForm
