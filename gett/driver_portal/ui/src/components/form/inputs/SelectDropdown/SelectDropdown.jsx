import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { SelectDropdown as SelectDropdownBase } from 'components/SelectDropdown'
import styled from 'styled-components'

class SelectDropdown extends PureComponent {
  static propTypes = {
    values: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    includeBlank: PropTypes.bool,
    error: PropTypes.string
  }

  getValues() {
    const { values, includeBlank } = this.props

    return includeBlank ? { '': 'Select', ...values } : values
  }

  render() {
    const { error, value, ...rest } = this.props
    return (
      <div>
        <SelectDropdownBase selected={ value || '' } values={ this.getValues() } { ...rest } />
        { error && <Error>{ error }</Error> }
      </div>
    )
  }
}

const Error = styled.div`
  font-size: 12px;
  text-align: left;
  color: #f00;
  margin-top: 10px;
`

export default SelectDropdown
