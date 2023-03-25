import React, { Component } from 'react'
import styled from 'styled-components'
import { IconSmallArrow, IconCar } from 'components/Icons'

class ActiveVehicle extends Component {
  render() {
    const { active, selected, placeholder } = this.props
    return (
      <Wrapper onClick={ this.props.onClick }>
        <InputWrapper>
          <IconCar color="#f6b530" />
          <Input
            value={ selected }
            readOnly
            placeholder={ placeholder }
          />
        </InputWrapper>
        <StyledIconArrow position={ active ? 180 : 0 } color={ active ? '#ffffff' : '#d2dadc' } />
      </Wrapper>
    )
  }
}

const Input = styled.input`
  cursor: pointer;
  width: 150px;
  margin-left: 15px;
  background: none;
  border: none;
  color: #fff;
`

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0px;
`

const StyledIconArrow = styled(IconSmallArrow)`
  transform: rotate(${props => props.position}deg);
  margin: 0px 1px;
`

export default ActiveVehicle
