import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'components/Button'
import styled, { css } from 'styled-components'

class ButtonSwitch extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    error: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.bool,
    disabled: PropTypes.bool
  }

  toggleOn = (e) => {
    this.props.onChange(true, e)
  }

  toggleOff = (e) => {
    this.props.onChange(false, e)
  }

  render() {
    const { error, label, value, disabled } = this.props

    return (
      <Fragment>
        { label && <Label>{ label }</Label> }
        <Wrapper>
          <ButtonStyled
            onClick={ this.toggleOn }
            active={ value === true }
            disabled={ disabled }
          >
            Yes
          </ButtonStyled>

          <ButtonStyled
            onClick={ this.toggleOff }
            active={ value === false }
            disabled={ disabled }
          >
            No
          </ButtonStyled>
        </Wrapper>
        { error && <Error>{ error }</Error> }
      </Fragment>
    )
  }
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
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

const Error = styled.div`
  font-size: 12px;
  text-align: left;
  color: #f00;
  margin-top: 10px;
`

const ButtonStyled = styled(Button)`
  width: calc(50% - 10px);

  &:hover:disabled {
    background: #d2dadc;
    border: 1px solid #a8a8b5;
    color: #fff;
    cursor: auto;
  }

  ${props => !props.active && css`
    background: transparent;
    color: #a8a8b5;
    border: solid 1px #a8a8b5;

    &:hover {
      color: #000;
      border: 0;
    }
  `}
`

export default ButtonSwitch
