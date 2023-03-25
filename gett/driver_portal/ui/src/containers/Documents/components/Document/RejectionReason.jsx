import React, { Fragment } from 'react'
import styled from 'styled-components'

import { Dialog, DialogHeader, DialogBody, DialogFooter } from 'components/Dialog'
import { Button } from 'components/Button'
import { media } from 'components/Media'

const RejectionReason = ({ active, onClose, reason }) => (
  <Dialog active={ active } width={ 700 }>
    <DialogHeader close>
      Rejection reason
    </DialogHeader>
    <DialogBody>{ reason }</DialogBody>
    <DialogFooter>
      {
        <Fragment>
          <Close onClick={ onClose }>
            Close
          </Close>
        </Fragment>
      }
    </DialogFooter>
  </Dialog>
)

const Close = styled(Button)`
  background-color: #fff;
  border: solid 1px #f6b530;

  &:hover {
    background-color: #e1a62c;
  }

  ${media.phoneLarge`
    margin-right: 0px;
  `}
`

export default RejectionReason
