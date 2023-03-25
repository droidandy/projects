import React, { Component, Fragment } from 'react'
import styled from 'styled-components'

import { Dialog, DialogHeader, DialogBody, DialogFooter } from 'components/Dialog'
import { Button } from 'components/Button'
import { media } from 'components/Media'
import { Loader } from 'components/Loader'
import { Cropper } from 'components/Cropper'

class NewsCropper extends Component {
  state = {
    apply: false
  }

  componentWillReceiveProps(newProps) {
    if (this.props.active !== newProps.active) {
      this.setState({ apply: false })
    }
  }

  render() {
    const { active, closeNewsCropper, loading, image, handleCrop } = this.props
    const { apply } = this.state

    return (
      <Dialog onClose={ closeNewsCropper } active={ active } width={ 900 }>
        <DialogHeader close>
          Adjust Image
        </DialogHeader>
        <DialogBodyStyled>
          <Cropper
            height={ 550 }
            width={ 820 }
            min={ 0.1 }
            max={ 3 }
            image={ image }
            onCrop={ handleCrop }
            apply={ apply }
            type="rectangle"
          />
        </DialogBodyStyled>
        <DialogFooterStyled>
          {
            loading ? <Loader color="#FDB924" />
              : <Fragment>
                <Save onClick={ this.save }>Apply</Save>
                <Cancel onClick={ closeNewsCropper }>Cancel</Cancel>
              </Fragment>
          }
        </DialogFooterStyled>
      </Dialog>
    )
  }

  save = () => {
    this.setState({ apply: true })
  }
}

const Save = styled(Button)`
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

const DialogBodyStyled = styled(DialogBody)`
  padding: 30px 20px 5px 20px
`

const DialogFooterStyled = styled(DialogFooter)`
  margin: 25px 0 25px 0;
`

export default NewsCropper
