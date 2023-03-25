import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { isEqual, isEmpty } from 'lodash'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from 'components/Dialog'
import { Button } from 'components/Button'
import { media } from 'components/Media'
import { Loader } from 'components/Loader'

import UserFields from './UserFields'

class EditProfileDialog extends Component {
  state = {
    attributes: {
      firstName: '',
      lastName: '',
      role: '',
      email: '',
      active: true
    },
    errors: {}
  }

  componentWillReceiveProps(nextProps) {
    const { active, user, data: { errors } } = nextProps
    if (active !== this.props.active) {
      this.clear()
    }
    if (user && !isEqual(user, this.props.user)) {
      this.initUser(nextProps)
    }
    if (!isEmpty(errors)) {
      this.setState(state => ({
        ...state,
        errors: errors
      }))
    }
  }

  initUser(nextProps) {
    const { user: { email, firstName, lastName, roles, active } } = nextProps
    this.setState(state => ({
      ...state,
      attributes: {
        email,
        firstName,
        lastName,
        role: roles[0],
        active
      }
    }))
  }

  render() {
    const { active, onClose, data: { loading } } = this.props
    const { attributes, errors } = this.state
    return (
      <Dialog onClose={ onClose } active={ active } width={ 700 }>
        <DialogHeader close>
          User Edit
        </DialogHeader>
        <DialogBodyStyled>
          <div title="User Fields">
            <UserFields
              attributes={ attributes }
              errors={ errors }
              update={ this.update }
              onSelect={ this.select }
            />
          </div>
        </DialogBodyStyled>
        <DialogFooterStyled>
          {
            loading ? <Loader color="#FDB924" />
              : <Fragment>
                <Save onClick={ this.save }>Save</Save>
                <Cancel onClick={ onClose }>Cancel</Cancel>
              </Fragment>
          }
        </DialogFooterStyled>
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

  select = () => {
    this.setState(state => ({
      ...state,
      attributes: { ...state.attributes, active: !state.attributes.active },
      errors: { ...state.errors, active: [] }
    }))
  }

  clear = () => {
    this.setState({ attributes: { firstName: '', lastName: '', role: 'site_admin', email: '', active: true }, errors: {} })
  }

  save = () => {
    const { user, action } = this.props
    const { attributes } = this.state
    if (user) {
      action({ user: { ...attributes, id: user.id } })
    } else {
      action({ user: attributes })
    }
  }
}

const DialogBodyStyled = styled(DialogBody)`
  padding: 30px 0 0 0;
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

const DialogFooterStyled = styled(DialogFooter)`
  margin: 40px 0px 40px 0px;
`

export default EditProfileDialog
