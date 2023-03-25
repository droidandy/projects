import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { isEmpty, debounce } from 'lodash'
import { camelizeKeys } from 'humps'
import { Dropdown, DropdownItem } from 'components/Dropdown'
import { TextField } from 'components/TextField'
import { geocodeByPlaceId } from './utils'

const google = window.google

const options = {
  types: ['address'],
  componentRestrictions: { country: 'uk' }
}

class AddressAutocomplete extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    onGeocode: PropTypes.func
  }

  static defaultProps = {
    onChange: undefined,
    onSelect: undefined,
    onGeocode: undefined
  }

  constructor(props) {
    super(props)
    this.service = new google.maps.places.AutocompleteService()
    this.state = {
      value: '',
      suggestions: []
    }
  }

  get value() {
    return this.props.value || this.state.value
  }

  getPlace = debounce((value) => {
    this.service.getPlacePredictions({ input: value, ...options }, (predictions, status) => {
      if (status === 'OK' && predictions && predictions.length > 0) {
        this.setState({
          suggestions: camelizeKeys(predictions)
        }, () => this.autocomplete.open())
      }
    })
  }, 500)

  change = value => {
    this.setState({ value }, () => {
      this.props.onChange(value)
      this.getPlace(value)
    })
  }

  select = suggestion => {
    const { onGeocode, onSelect } = this.props
    const { description, placeId } = suggestion

    if (onGeocode) {
      geocodeByPlaceId(placeId)
        .then(results => onGeocode(results))
        .catch(error => console.error(error))
    }

    this.setState({ value: description }, () => {
      onSelect(suggestion)
    })
  }

  renderItem = (suggestion) => {
    const { description, id } = suggestion
    return (
      <DropdownItem
        key={ id }
        onClick={ () => this.select(suggestion) }
      >
        { description }
      </DropdownItem>
    )
  }

  render() {
    const { className, label } = this.props
    const { suggestions } = this.state
    return (
      <Wrapper className={ className }>
        <Label>{ label }</Label>
        <Dropdown
          responsive
          indent={ 40 }
          ref={ node => this.autocomplete = node }
          trigger={
            <TextField
              value={ this.value }
              onChange={ this.change }
            />
          }
        >
          { !isEmpty(suggestions) && suggestions.map(this.renderItem) }
        </Dropdown>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  flex: 1;
`

const Label = styled.div`
  font-size: 10px;
  font-weight: bold;
  color: #a9b1ba;
  text-transform: uppercase;
`

export default AddressAutocomplete
