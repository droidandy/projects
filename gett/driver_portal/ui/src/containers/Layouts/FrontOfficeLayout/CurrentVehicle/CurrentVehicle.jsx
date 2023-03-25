import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { media } from 'components/Media'
import { find, isEqual, isEmpty } from 'lodash'
import { Dropdown, DropdownItem } from 'components/Dropdown'
import { IconCheckMarkBig } from 'components/Icons'
import ActiveVehicle from './ActiveVehicle'

class CurrentVehicle extends Component {
  state = {
    current: ''
  }

  componentDidMount() {
    const { vehicles } = this.props
    this.setCurrentVehicle(vehicles)
  }

  componentWillReceiveProps(nextProps) {
    const { vehicles } = nextProps
    if (!isEqual(vehicles, this.props.vehicles)) {
      this.setCurrentVehicle(vehicles)
    }
  }

  get placeholder() {
    const { current } = this.state
    const { vehicles } = this.props
    if (isEmpty(vehicles)) {
      return 'No vehicles'
    } else if (isEmpty(current) && !isEmpty(vehicles)) {
      return 'Select Vehicle'
    }
  }

  setCurrentVehicle(vehicles) {
    const currentVehicle = find(vehicles, vehicle => vehicle.isCurrent)
    if (currentVehicle) {
      this.setState({
        current: currentVehicle.title
      })
    }
  }

  changeVehicle = vehicle => {
    const { setVehicle } = this.props
    this.setState({
      current: vehicle.title
    }, () => setVehicle(vehicle))
  }

  renderVehicles() {
    const { vehicles } = this.props
    return vehicles.map((car, i) => {
      const { title, isCurrent } = car
      return (
        <Item
          active={ isCurrent }
          onClick={ () => this.changeVehicle(car) }
          key={ i }
        >
          { title }
          <IconCheckMarkBig key={ i } color="#f6b530" />
        </Item>
      )
    })
  }

  render() {
    const { className, vehicles } = this.props
    const { current } = this.state
    return (
      <Wrapper className={ className }>
        <Label>Current car</Label>
        <DropdownHolder
          disabled={ isEmpty(vehicles) }
          trigger={ <ActiveVehicle placeholder={ this.placeholder } selected={ current } /> }
          responsive
          indent={ 40 }
          onChange={ this.changeVehicle }
          nooverlay
        >
          { this.renderVehicles() }
        </DropdownHolder>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  padding:30px 0;
  border-bottom: 1px solid #74818f;
  ${media.phoneLarge`
    border-top: 1px solid #74818f;
  `}
`
const DropdownHolder = styled(Dropdown)`
  display: flex;
  flex: 1;
`

const Label = styled.div`
  font-size: 10px;
  font-weight: bold;
  color: #a9b1ba;
  text-transform: uppercase;
`

const Item = styled(DropdownItem)`
  font-size: 14px;
  align-items: center;
  justify-content: space-between;
  text-transform: none;
  font-weight: normal;
  
  ${props => props.active ? css`
    svg { display: block; }
  ` : css`
    svg { display: none; }
  `};
`

export default CurrentVehicle
