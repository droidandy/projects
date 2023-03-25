import React, { Component, Fragment } from 'react'
import styled from 'styled-components'

import { Dialog, DialogHeader, DialogBody, DialogFooter } from 'components/Dialog'
import { Button } from 'components/Button'
import { media } from 'components/Media'

class ConfirmationDialog extends Component {
  render() {
    const { active, onClose, onRemove } = this.props

    return (
      <Dialog onClose={ onClose } active={ active } width={ 700 }>
        <DialogHeader close>
          Confirm vehicle remove
        </DialogHeader>
        <DialogBodyStyled>
          <div>
            Are you sure you want to remove vehicle?
          </div>
        </DialogBodyStyled>
        <DialogFooter>
          {
            <Fragment>
              <Remove onClick={ onRemove }>Remove</Remove>
              <Cancel onClick={ onClose }>Cancel</Cancel>
            </Fragment>
          }
        </DialogFooter>
      </Dialog>
    )
  }
}

const DialogBodyStyled = styled(DialogBody)`
  text-align: center;
`

const Remove = styled(Button)`
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

export default ConfirmationDialog
