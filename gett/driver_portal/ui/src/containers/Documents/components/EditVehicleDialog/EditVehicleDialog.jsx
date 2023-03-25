import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { TextField } from 'components/TextField'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from 'components/Dialog'
import { Button } from 'components/Button'
import { media } from 'components/Media'
import { Loader } from 'components/Loader'

class EditVehicleDialog extends Component {
  state = {
    vehicle: {
      title: ''
    },
    errors: {}
  }

  componentWillReceiveProps(nextProps) {
    const { active, vehicle, data: { errors } } = nextProps
    if (active !== this.props.active) {
      this.clear()
    }
    if (vehicle) {
      this.setState({ vehicle })
    }
    if (errors) {
      this.setState({ errors })
    }
  }

  render() {
    const { active, onClose, data: { loading }, width, vehicle } = this.props
    const { vehicle: { title }, errors } = this.state
    const titleText = vehicle ? 'Rename your vehicle' : 'Create new vehicle'
    const buttonText = vehicle ? 'Update' : 'Create'

    return (
      <Dialog onClose={ onClose } active={ active } width={ width }>
        <DialogHeader close> { titleText }</DialogHeader>
        <DialogBodyStyled>
          <Text>The vehicle name is for your reference only and won't be shown to the passenger.</Text>
          <InputWrapper>
            <Label>Vehicle name</Label>
            <TextField
              value={ title }
              onChange={ this.update }
              errors={ errors.title }
              autofocus
            />
          </InputWrapper>
        </DialogBodyStyled>
        <StyledFooter>
          {
            loading ? <Loader color="#FDB924" />
              : <Fragment>
                <Save onClick={ this.save }>{ buttonText }</Save>
                <Cancel onClick={ onClose }>Cancel</Cancel>
              </Fragment>
          }
        </StyledFooter>
      </Dialog>
    )
  }

  update = (title) => {
    this.setState(state => ({
      vehicle: {
        ...state.vehicle,
        title
      },
      errors: []
    }))
  }

  save = () => {
    const { vehicle } = this.state
    this.props.saveVehicle({ vehicle })
  }

  clear = () => {
    this.setState({ vehicle: { title: '' }, errors: {} })
  }
}

const DialogBodyStyled = styled(DialogBody)`
  padding: 25px 30px 0;
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

const InputWrapper = styled.div`
  margin-top: 30px;
  padding:0 20px;
`

const Text = styled.div`
  font-size: 14px;
`

const Label = styled.div`
  font-size: 10px;
  font-weight: bold;
  color: #a9b1ba;
  text-transform: uppercase;
`

const StyledFooter = styled(DialogFooter)`
  margin: 40px 60px;
`

export default EditVehicleDialog
