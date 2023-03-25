import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import styled from 'styled-components'
import { AnonymousLayout } from 'containers/Layouts'
import { TextField } from 'components/TextField'
import { IconPassword } from 'components/Icons'
import { Button } from 'components/Button'
import { PasswordComplexity } from 'components/PasswordComplexity'
import * as mapDispatchToProps from './actions'
import { mapStateToProps } from './reducers'

class SetupPassword extends Component {
  state = {
    attrs: {
      password: '',
      passwordConfirmation: ''
    },
    errors: {}
  }

  componentWillMount() {
    this.props.initialize()
  }

  render() {
    const reset = {
      ...this.props.reset,
      ...this.state.attrs,
      errors: {
        ...this.props.reset.errors,
        ...this.state.errors
      }
    }

    if (reset.success) {
      return <Redirect to="/auth" />
    }

    return (
      <AnonymousLayout>
        <Header>Setup New Password</Header>
        <ResetPasswordForm>
          <TextField
            type="password"
            placeholder="Password"
            prefix={ <IconPassword color="#a8a8b5" /> }
            value={ reset.password }
            onChange={ this.update('password') }
            errors={ reset.errors.password }
          />

          <TextField
            type="password"
            placeholder="Password confirmation"
            prefix={ <IconPassword color="#a8a8b5" /> }
            value={ reset.passwordConfirmation }
            onChange={ this.update('passwordConfirmation') }
            errors={ reset.errors.passwordConfirmation }
          />

          <PasswordComplexity value={ reset.password } />

          <Buttons>
            <Button onClick={ this.setupPassword }>
              Setup
            </Button>
          </Buttons>
        </ResetPasswordForm>
      </AnonymousLayout>
    )
  }

  setupPassword = () => {
    const { password, passwordConfirmation } = this.state.attrs
    const { token } = this.props.match.params
    this.setState({ errors: {} })
    this.props.setupPassword({ token, password, passwordConfirmation })
  }

  update = (field) => (val) => {
    this.setState(state => ({
      ...state,
      attrs: { ...state.attrs, [field]: val },
      errors: { ...state.errors, [field]: [] }
    }))
  }
}

const ResetPasswordForm = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

const Header = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 500;
  color: #000000;
`

const Buttons = styled.div`
  margin-top: 30px;
`

export default connect(mapStateToProps, mapDispatchToProps)(SetupPassword)
