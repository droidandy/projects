import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { omit } from 'lodash'
import { roleNameToLabel, roleLabels } from '../../utils/rolesToLabel'
import { Checkbox } from 'components/Checkbox'
import { SelectDropdown } from 'components/SelectDropdown'
import { TextField } from 'components/TextField'
import { media } from 'components/Media'

class UserFields extends Component {
  render() {
    const { attributes: { firstName, lastName, email, role, active }, errors, update, onSelect } = this.props
    return (
      <Fragment>
        <Wrapper>
          <Column>
            <Label>
              First Name
            </Label>
            <Field
              value={ firstName }
              onChange={ update('firstName') }
              errors={ errors.firstName }
            />
            <LabelMargin>
              Email
            </LabelMargin>
            <Field
              value={ email }
              onChange={ update('email') }
              errors={ errors.email }
            />
          </Column>
          <RightColumn>
            <Label>
              Last Name
            </Label>
            <Field
              value={ lastName }
              onChange={ update('lastName') }
              errors={ errors.lastName }
            />
            <LabelMargin>
              Role
            </LabelMargin>
            <StyledSelectDropdown
              width={ 255 }
              values={ omit(roleLabels, 'driver') }
              onChange={ update('role') }
              selected={ roleNameToLabel(role) }
              nooverlay
            />
          </RightColumn>
        </Wrapper>
        <ActiveStateHandler>
          <Checkbox
            checked={ active }
            onClick={ onSelect }
          />
          <div>Active user</div>
        </ActiveStateHandler>
      </Fragment>
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
  flex: 1;
  flex-direction: column;
`

const RightColumn = styled(Column)`
  margin-left: 40px;
`

const Label = styled.div`
  font-size: 10px;
  font-weight: bold;
  color: #a9b1ba;
  text-transform: uppercase;
`

const ActiveStateHandler = styled.div`
  display:flex;
  justify-content: center;
  margin-top: 30px;
  
  div:last-child {
    margin-left: 20px;
  }
`

const LabelMargin = styled(Label)`
  margin-top: 25px;
`

const Field = styled(TextField)`
  margin: 10px 0 0 0;
`

const StyledSelectDropdown = styled(SelectDropdown)`
  margin: 10px 0;
`

export default UserFields
