import React, { Component } from 'react'
import styled from 'styled-components'
import { TextField } from 'components/TextField'
import { PhoneField } from 'components/form'
import { media } from 'components/Media'
import { Avatar } from 'components/Avatar'
import { Button } from 'components/Button'
import { ColorDropdown } from 'components/ColorDropdown'

class Information extends Component {
  render() {
    const { attributes: { firstName, lastName, email, phone, city, vehicleReg, vehicleColour }, update, gettId } = this.props
    return (
      <Wrapper>
        <Column>
          <AvatarWrapper>
            <Avatar
              width={ 80 }
              height={ 80 }
              user={ this.props.user } />
            <Upload disabled>
              Change
            </Upload>
          </AvatarWrapper>
          <Label>
            First Name
          </Label>
          <TextField
            value={ firstName }
            onChange={ update('firstName') }
          />
          <LabelMargin>
            Last Name
          </LabelMargin>
          <TextField
            value={ lastName }
            onChange={ update('lastName') }
          />
          <LabelMargin>
            Phone
          </LabelMargin>
          <PhoneFieldStyled
            value={ phone }
            onChange={ update('phone') }
          />
          <LabelMargin>
            Email
          </LabelMargin>
          <TextField
            value={ email }
            onChange={ update('email') }
          />
        </Column>
        <ColumnRight>
          <Label>
            Gett ID
          </Label>
          <TextField
            disabled
            value={ gettId }
          />
          <LabelMargin>
            City
          </LabelMargin>
          <TextField
            value={ city }
            onChange={ update('city') }
          />
          <LabelMargin>
            Vehicle Colour
          </LabelMargin>
          <ColorDropdown
            value={ vehicleColour }
            onChange={ update('vehicleColour') }
          />
          <LabelMargin>
            Cab Registration Number
          </LabelMargin>
          <TextField
            value={ vehicleReg }
            onChange={ update('vehicleReg') }
          />
        </ColumnRight>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 50px 0 50px;

  ${media.phoneLarge`
    flex-direction: column;
    padding: 30px 20px 0 20px;
  `}
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.div`
  font-size: 10px;
  font-weight: bold;
  color: #a9b1ba;
  text-transform: uppercase;
`

const LabelMargin = styled(Label)`
  margin-top: 25px;

  ${media.phoneLarge`
    margin-top: 0px;
  `}
`

const AvatarWrapper = styled.div`
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  justify-content: space-between;
`

const ColumnRight = styled(Column)`
  margin-top: 5px;

  ${media.phoneLarge`
    margin-top: 0px;
  `}
`

const Upload = styled(Button)`
  display: none;
  background-color: #fff;
  border: solid 1px #f6b530;
  width: 70px;
  height: 30px;

  &:hover {
    background-color: #f6b530;
  }
`

const PhoneFieldStyled = styled(PhoneField)`
  > * > div {
    top: -17px;
  }
`

export default Information
