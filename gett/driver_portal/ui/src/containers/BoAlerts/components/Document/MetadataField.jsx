import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { TextField, DateTimePicker, DatePicker, ButtonSwitch } from 'components/form'
import styled from 'styled-components'

class MetadataField extends PureComponent {
  static propTypes = {
    $: PropTypes.func,
    type: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    disabled: PropTypes.bool
  }
  render() {
    const { $, type, name, title, disabled } = this.props

    return (
      <Fragment>
        { type === 'str' &&
          <TextFieldStyled
            { ...$(name) }
            label={ title }
            placeholder="Start typing"
            disabled={ disabled }
          />
        }
        { type === 'date_time' &&
          <Fragment>
            <Label>{ title }</Label>
            <DateTimePicker { ...$(name) } disabled={ disabled } border />
          </Fragment>
        }
        { type === 'date' &&
          <Fragment>
            <Label>{ title }</Label>
            <DatePicker { ...$(name) } disabled={ disabled } border />
          </Fragment>
        }
        { type === 'bool' &&
          <ButtonSwitch { ...$(name) } label={ title } disabled={ disabled } />
        }
      </Fragment>
    )
  }
}

const TextFieldStyled = styled(TextField)`
  margin-top: 20px;
`

const Label = styled.div`
  width: 100%;
  min-height: 13px;
  font-size: 10px;
  font-weight: bold;
  text-align: left;
  color: #a9b1ba;
  margin: 20px 0 5px;
  text-transform: uppercase;
`

export default MetadataField
