import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { AddressAutocomplete as AddressAutocompleteBase } from 'components/AddressAutocomplete'
import styled from 'styled-components'

class AddressAutocomplete extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    error: PropTypes.string
  }

  onChange = (value) => {
    this.props.onChange(value)
  }

  onSelect = (value) => {
    this.props.onChange(value.description)
  }

  onGeocode = (result) => {
    const { onChange, value } = this.props

    onChange(value, result)
  }

  render() {
    const { error, ...rest } = this.props

    return (
      <div>
        <AddressAutocompleteBase onChange={ this.onChange } onSelect={ this.onSelect } onGeocode={ this.onGeocode } { ...rest } />
        { error && <Error>{ error }</Error> }
      </div>
    )
  }
}

const Error = styled.div`
  font-size: 12px;
  text-align: left;
  color: #f00;
`

export default AddressAutocomplete
