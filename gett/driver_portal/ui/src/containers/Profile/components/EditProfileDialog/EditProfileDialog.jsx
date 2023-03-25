import React, { Component, Fragment } from 'react'
import styled from 'styled-components'

import { Dialog, DialogHeader, DialogBody, DialogFooter } from 'components/Dialog'
import { Button } from 'components/Button'
import { media } from 'components/Media'
import { Tabs } from 'components/Tabs'
import { Loader } from 'components/Loader'

import Information from './Information'

const DEFAULT_CAR_COLOR = 'Other'

class EditProfileDialog extends Component {
  state = {
    attributes: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      city: '',
      vehicleReg: '',
      vehicleColour: DEFAULT_CAR_COLOR
    },
    gettId: '',
    errors: {}
  }

  componentDidMount() {
    const { user: { location, gettId }, user } = this.props
    this.setState(state => ({
      ...state,
      attributes: {
        ...state.attributes,
        ...user,
        city: location && location.city
      },
      gettId
    }))
  }

  render() {
    const { active, onClose, user, update: { loading } } = this.props
    const { attributes, gettId } = this.state
    return (
      <Dialog onClose={ onClose } active={ active } width={ 700 }>
        <DialogHeader close>
          Profile Edit
        </DialogHeader>
        <DialogBodyStyled>
          <Tabs delimeter>
            <div title="Information">
              <Information
                attributes={ attributes }
                gettId={ gettId }
                user={ user }
                update={ this.update }
              />
            </div>
          </Tabs>
        </DialogBodyStyled>
        <DialogFooter>
          {
            loading ? <Loader color="#FDB924" />
              : <Fragment>
                <Save onClick={ this.save }>Save</Save>
                <Cancel onClick={ onClose }>Cancel</Cancel>
              </Fragment>
          }
        </DialogFooter>
      </Dialog>
    )
  }

  update = (field) => (val) => {
    this.setState(state => ({
      ...state,
      attributes: { ...state.attributes, [field]: val },
      errors: { ...state.errors, [field]: [] }
    }))
  }

  save = () => {
    this.props.updateUser({ user: this.state.attributes, history: this.props.history, url: 'profilecab' })
  }
}

const DialogBodyStyled = styled(DialogBody)`
  padding: 25px 0;
`

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

export default EditProfileDialog
