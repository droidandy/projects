import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { TextField } from 'components/form'
import styled from 'styled-components'
import { media } from 'components/Media'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from 'components/Dialog'
import { Button } from 'components/Button'
import { Loader } from 'components/Loader'

class ConfirmationDialog extends Component {
  static propTypes = {
    active: PropTypes.bool,
    onConfirm: PropTypes.func,
    onClose: PropTypes.func,
    $: PropTypes.func
  }

  render() {
    const { $, active, onConfirm, onClose, loading } = this.props

    return (
      <Dialog onClose={ onClose } active={ active } width={ 600 }>
        <DialogHeader close>Confirmation</DialogHeader>
        <DialogBodyStyled>
          <Text>Please confirm your changes with your Driver Portal account password</Text>
          <TextFieldStyled
            { ...$('password') }
            type="password"
            label="Password"
            placeholder="Type your password"
          />
        </DialogBodyStyled>
        <DialogFooterStyled>
          { loading
            ? <Loader color="#FDB924" />
            : <Fragment>
              <Save onClick={ onConfirm }>Save</Save>
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

const Text = styled.div`
  text-align: center;
  margin-bottom: 30px;

  ${media.phoneLarge`
    padding: 0 10px;
  `}
`

const TextFieldStyled = styled(TextField)`
  width: 296px;
  margin: 0 auto;
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

export default ConfirmationDialog
